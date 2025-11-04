import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import connect from "@/lib/data";
import Product from "@/models/product";
import { CartItem } from "@/lib/types";
import "@/lib/types";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

interface PropertyItem {
  name?: string;
  value?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Payment Request Started ===');
    const { cartItems, shippingAddress } = await request.json();
    console.log('Request data:', { cartItemsCount: cartItems?.length, hasShippingAddress: !!shippingAddress });

    // Verify authentication
    const token = request.headers.get("Authorization")?.split(" ")[1];
    console.log('Token present:', !!token);
    if (!token) {
      console.log('ERROR: No token provided');
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as CustomJwtPayload;
      userId = decoded.userId;
      console.log('Token verified, userId:', userId);
    } catch (error) {
      console.log('ERROR: Token verification failed:', error);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    // Validate cart items
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      console.log('ERROR: Invalid cart items:', { cartItems, isArray: Array.isArray(cartItems) });
      return NextResponse.json(
        {
          success: false,
          message: "Cart is empty",
        },
        { status: 400 }
      );
    }
    console.log('Cart validation passed, items count:', cartItems.length);

    // Connect to database and validate products
    console.log('Connecting to database...');
    await connect();
    console.log('Database connected successfully');

    let totalAmount = 0;
    const validatedItems: CartItem[] = [];

    for (const item of cartItems) {
      console.log('Processing cart item:', { productId: item.productId, quantity: item.quantity });
      // Extract actual product ID from composite key (format: productId_#colorCode_{properties})
      const actualProductId = item.productId.split("_")[0];
      console.log('Extracted product ID:', actualProductId);
      const product = await Product.findById(actualProductId);
      if (!product) {
        console.log('ERROR: Product not found:', actualProductId);
        return NextResponse.json(
          {
            success: false,
            message: `Product not found: ${item.productId}`,
          },
          { status: 400 }
        );
      }
      console.log('Product found:', { id: product._id, price: product.price, discount: product.discount });

      // Use server-side price, not client-side price
      let serverPrice = parseFloat(product.price);

      // Apply discount if exists
      if (product.discount && parseFloat(product.discount) > 0) {
        const discountPercent = parseFloat(product.discount);
        serverPrice = serverPrice * (1 - discountPercent / 100);
      }

      if (isNaN(serverPrice)) {
        console.log('ERROR: Invalid server price:', { serverPrice, originalPrice: product.price, discount: product.discount });
        return NextResponse.json(
          {
            success: false,
            message: `Invalid price for product: ${item.productId}`,
          },
          { status: 400 }
        );
      }

      const itemTotal = serverPrice * item.quantity;
      totalAmount += itemTotal;
      console.log('Item processed:', { productId: actualProductId, serverPrice, quantity: item.quantity, itemTotal });

      const validatedItem: CartItem = {
        productId: actualProductId,
        quantity: item.quantity,
        price: serverPrice,
      };

      // Add color and properties if they exist
      if (item.colorCode) {
        validatedItem.colorCode = item.colorCode;
      }

      if (item.properties && item.properties.length > 0) {
        // Ensure properties are in the correct format for the Order model
        validatedItem.properties = Array.isArray(item.properties)
          ? item.properties.map((prop: string | PropertyItem) =>
              typeof prop === "string"
                ? { name: "property", value: prop }
                : {
                    name: prop.name || "property",
                    value: prop.value || String(prop),
                  }
            )
          : [];
      }

      validatedItems.push(validatedItem);
    }
    console.log('All items validated. Total amount:', totalAmount, 'Toman');

    // Validate minimum amount (100 Toman = 100,000 Rials)
    // if (totalAmount < 100000) {
    //   return NextResponse.json({
    //     success: false,
    //     message: "حداقل مبلغ پرداخت 100 تومان است"
    //   }, { status: 400 });
    // }

    // Store secure order data in database temporarily
    const orderData = {
      userId,
      products: validatedItems,
      totalAmount,
      shippingAddress,
      status: "pending_payment",
      paymentStatus: "pending",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiry
    };
    console.log('Order data prepared:', { userId, productsCount: validatedItems.length, totalAmount });

    const paymentData = {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: Math.round(totalAmount * 10000), // Convert Toman to Rials
      callback_url: `${process.env.NEXT_PUBLIC_BASE_USERWEBSITE_PAYMENT_URL}/payment/verify`,
      description: `خرید ${validatedItems.length} محصول`,
      metadata: {
        userId,
        orderHash: Buffer.from(JSON.stringify(orderData)).toString("base64"),
      },
    };
    console.log('Payment data prepared:', {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID ? 'SET' : 'NOT SET',
      amount: paymentData.amount,
      callback_url: paymentData.callback_url,
      description: paymentData.description
    });

    console.log('Sending request to Zarinpal...');
    const response = await fetch(
      "https://payment.zarinpal.com/pg/v4/payment/request.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(paymentData),
      }
    );

    console.log('Zarinpal response status:', response.status);
    const result = await response.json();
    console.log('Zarinpal response:', result);

    if (result.data?.code === 100) {
      console.log('Payment request successful, authority:', result.data.authority);
      // Store order data with authority for verification
      const pendingOrder = {
        ...orderData,
        authority: result.data.authority,
        paymentAmount: totalAmount * 10, // Store in Rials for verification
      };

      // In production, store this in Redis or database with TTL
      // For now, we'll use a simple in-memory store with cleanup
      (global as Record<string, unknown>).pendingOrders =
        (global as Record<string, unknown>).pendingOrders || new Map();
      (
        (global as Record<string, unknown>).pendingOrders as Map<
          string,
          unknown
        >
      ).set(result.data.authority, pendingOrder);

      // Cleanup expired orders
      setTimeout(() => {
        (
          (global as Record<string, unknown>).pendingOrders as Map<
            string,
            unknown
          >
        )?.delete(result.data.authority);
      }, 15 * 60 * 1000);

      const paymentUrl = `https://payment.zarinpal.com/pg/StartPay/${result.data.authority}`;
      console.log('Payment URL generated:', paymentUrl);

      return NextResponse.json({
        success: true,
        authority: result.data.authority,
        paymentUrl,
        amount: totalAmount, // Return validated amount in Toman
      });
    } else {
      console.log('ERROR: Zarinpal request failed:', {
        code: result.data?.code,
        errors: result.errors,
        fullResponse: result
      });
      return NextResponse.json(
        {
          success: false,
          message: result.errors?.[0]?.message || "Payment request failed",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("=== CRITICAL ERROR in Payment Request ===");
    console.log("Error type:", (error as Error)?.constructor?.name);
    console.log("Error message:", (error as Error)?.message);
    console.log("Error stack:", (error as Error)?.stack);
    console.log("Full error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
