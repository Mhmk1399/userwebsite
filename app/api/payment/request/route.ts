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
    const { cartItems, shippingAddress } = await request.json();

    // Verify authentication
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
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
    } catch {
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
      return NextResponse.json(
        {
          success: false,
          message: "Cart is empty",
        },
        { status: 400 }
      );
    }

    // Connect to database and validate products
    await connect();

    let totalAmount = 0;
    const validatedItems: CartItem[] = [];

    for (const item of cartItems) {
      // Extract actual product ID from composite key (format: productId_#colorCode_{properties})
      const actualProductId = item.productId.split("_")[0];
      const product = await Product.findById(actualProductId);
      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message: `Product not found: ${item.productId}`,
          },
          { status: 400 }
        );
      }

      // Use server-side price, not client-side price
      let serverPrice = parseFloat(product.price);

      // Apply discount if exists
      if (product.discount && parseFloat(product.discount) > 0) {
        const discountPercent = parseFloat(product.discount);
        serverPrice = serverPrice * (1 - discountPercent / 100);
      }

      if (isNaN(serverPrice)) {
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

    const paymentData = {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: Math.round(totalAmount * 10), // Convert Toman to Rials
      callback_url: `${process.env.NEXT_PUBLIC_BASE_USERWEBSITE_PAYMENT_URL}/payment/verify`,
      description: `خرید ${validatedItems.length} محصول`,
      metadata: {
        userId,
        orderHash: Buffer.from(JSON.stringify(orderData)).toString("base64"),
      },
    };

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

    const result = await response.json();

    if (result.data?.code === 100) {
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

      return NextResponse.json({
        success: true,
        authority: result.data.authority,
        paymentUrl,
        amount: totalAmount, // Return validated amount in Toman
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.errors?.[0]?.message || "Payment request failed",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Payment request error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
