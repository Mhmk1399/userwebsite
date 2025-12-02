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
    console.log("=== ZarinPal Payment Request Started ===");
    const { cartItems, shippingAddress } = await request.json();
    console.log("Request data:", {
      cartItemsCount: cartItems?.length,
      hasShippingAddress: !!shippingAddress,
    });

    // Verify authentication
    const token = request.headers.get("Authorization")?.split(" ")[1];
    console.log("Token present:", !!token);
    if (!token) {
      console.log("ERROR: No token provided");
      return NextResponse.json(
        {
          success: false,
          message: "غیر مجاز - لطفاً وارد شوید",
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
      console.log("Token verified, userId:", userId);
    } catch (error) {
      console.log("ERROR: Token verification failed:", error);
      return NextResponse.json(
        {
          success: false,
          message: "توکن نامعتبر",
        },
        { status: 401 }
      );
    }

    // Validate cart items
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      console.log("ERROR: Invalid cart items:", {
        cartItems,
        isArray: Array.isArray(cartItems),
      });
      return NextResponse.json(
        {
          success: false,
          message: "سبد خرید خالی است",
        },
        { status: 400 }
      );
    }
    console.log("Cart validation passed, items count:", cartItems.length);

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      console.log("ERROR: Invalid shipping address");
      return NextResponse.json(
        {
          success: false,
          message: "آدرس تحویل کامل نیست",
        },
        { status: 400 }
      );
    }

    // Connect to database and validate products
    console.log("Connecting to database...");
    await connect();
    console.log("Database connected successfully");

    let totalAmount = 0;
    const validatedItems: CartItem[] = [];

    for (const item of cartItems) {
      console.log("Processing cart item:", {
        productId: item.productId,
        quantity: item.quantity,
      });
      
      // Extract actual product ID (handle both direct ID and composite key format)
      const actualProductId = typeof item.productId === 'string' 
        ? item.productId.includes('_') ? item.productId.split("_")[0] : item.productId
        : item.productId;
      
      console.log("Using product ID:", actualProductId);
      const product = await Product.findById(actualProductId);
      
      if (!product) {
        console.log("ERROR: Product not found:", actualProductId);
        return NextResponse.json(
          {
            success: false,
            message: `محصول یافت نشد: ${item.productId}`,
          },
          { status: 400 }
        );
      }
      console.log("Product found:", {
        id: product._id,
        name: product.name,
        price: product.price,
        discount: product.discount,
      });

      // Use server-side price, not client-side price
      let serverPrice = parseFloat(product.price);

      // Apply discount if exists
      if (product.discount && parseFloat(product.discount) > 0) {
        const discountPercent = parseFloat(product.discount);
        serverPrice = serverPrice * (1 - discountPercent / 100);
      }

      if (isNaN(serverPrice)) {
        console.log("ERROR: Invalid server price:", {
          serverPrice,
          originalPrice: product.price,
          discount: product.discount,
        });
        return NextResponse.json(
          {
            success: false,
            message: `قیمت محصول نامعتبر است`,
          },
          { status: 400 }
        );
      }

      const itemTotal = serverPrice * item.quantity;
      totalAmount += itemTotal;
      console.log("Item processed:", {
        productId: actualProductId,
        serverPrice,
        quantity: item.quantity,
        itemTotal,
      });

      const validatedItem: CartItem = {
        productId: actualProductId,
        quantity: item.quantity,
        price: serverPrice,
        name: product.name, // Include name for description
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
    console.log("All items validated. Total amount:", totalAmount, "Toman");

    // Validate minimum amount (100 Toman)
    if (totalAmount < 100) {
      console.log("ERROR: Amount below minimum:", totalAmount);
      return NextResponse.json(
        {
          success: false,
          message: "مبلغ باید حداقل ۱۰۰ تومان باشد",
        },
        { status: 400 }
      );
    }

    // Fetch user info from database
    let userInfo = {
      name: "مشتری",
      phone: "0000000000",
    };

    try {
      const StoreUsers = (await import("@/models/storesUsers")).default;
      const user = await StoreUsers.findById(userId).select("name phone");
      if (user) {
        userInfo = {
          name: user.name || "مشتری",
          phone: user.phone || "0000000000",
        };
        console.log("User info fetched:", {
          name: userInfo.name,
          phone: userInfo.phone,
        });
      } else {
        console.log("Warning: User not found, using default info");
      }
    } catch (error) {
      console.log("Warning: Could not fetch user info:", error);
    }

    // Create order data to store temporarily (will be saved after payment verification)
    const orderData = {
      userId,
      storeId: process.env.STORE_ID,
      products: validatedItems,
      totalAmount,
      shippingAddress,
      status: "pending",
      paymentStatus: "pending",
      customerName: userInfo.name,
      customerPhone: userInfo.phone,
      createdAt: new Date(),
    };

    // Generate unique order ID for tracking
    const orderId = `ORDER-${Date.now()}`;
    console.log("Order ID generated:", orderId);

    // Prepare ZarinPal payment request
    const description = `خرید ${validatedItems.length} محصول از ${process.env.STORE_TITLE || 'فروشگاه'}`;
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');
    const callbackUrl = `${baseUrl}/api/payment/callback`;
    
    const zarinpalData = {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: totalAmount, // Amount in Toman (ZarinPal API expects Toman now, not Rials)
      callback_url: callbackUrl,
      description,
      metadata: {
        mobile: userInfo.phone,
        order_id: orderId,
      },
    };

    console.log("ZarinPal request data:", {
      merchant_id: zarinpalData.merchant_id ? "SET" : "NOT SET",
      amount: zarinpalData.amount,
      callback_url: zarinpalData.callback_url,
      description: zarinpalData.description,
    });

    // Request payment from ZarinPal
    console.log("Sending request to ZarinPal...");
    const zarinpalResponse = await fetch(
      "https://payment.zarinpal.com/pg/v4/payment/request.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(zarinpalData),
      }
    );

    console.log("ZarinPal response status:", zarinpalResponse.status);
    const zarinpalResult = await zarinpalResponse.json();
    console.log("ZarinPal response:", zarinpalResult);

    if (zarinpalResult.data?.code === 100 && zarinpalResult.data?.authority) {
      const authority = zarinpalResult.data.authority;
      console.log("Payment request successful, authority:", authority);

      // Store order data temporarily with authority for verification
      // In production, use Redis or database with TTL
      (global as Record<string, unknown>).pendingOrders =
        (global as Record<string, unknown>).pendingOrders || new Map();
      
      const pendingOrder = {
        ...orderData,
        orderId,
        authority,
      };

      ((global as Record<string, unknown>).pendingOrders as Map<string, unknown>)
        .set(authority, pendingOrder);

      // Cleanup expired orders after 15 minutes
      setTimeout(() => {
        ((global as Record<string, unknown>).pendingOrders as Map<string, unknown>)
          ?.delete(authority);
      }, 15 * 60 * 1000);

      // Build payment URL - ALWAYS use full absolute ZarinPal URL
      // CRITICAL: This must be the complete URL including protocol and domain
      // DO NOT return relative URLs like "/pg/StartPay/..." or "pg/StartPay/..."
      // The frontend will use this URL directly with window.location.href
      const paymentUrl = `https://payment.zarinpal.com/pg/StartPay/${authority}`;
      
      console.log("=== Payment URL Details ===");
      console.log("Authority:", authority);
      console.log("Full Payment URL:", paymentUrl);
      console.log("URL starts with https://payment.zarinpal.com:", paymentUrl.startsWith("https://payment.zarinpal.com"));
      console.log("URL length:", paymentUrl.length);
      console.log("===========================");

      // Validate the URL is absolute before returning
      if (!paymentUrl.startsWith("https://payment.zarinpal.com")) {
        console.log("ERROR: Payment URL is not absolute!", paymentUrl);
        return NextResponse.json(
          {
            success: false,
            error: "خطا در ساخت URL پرداخت",
            message: "URL پرداخت نامعتبر است",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "درخواست پرداخت با موفقیت ایجاد شد",
        data: {
          authority,
          paymentUrl,
          amount: totalAmount,
          orderId,
        },
      });
    } else {
      console.log("ERROR: ZarinPal request failed:", {
        code: zarinpalResult.data?.code,
        errors: zarinpalResult.errors,
      });
      
      // Map common ZarinPal error codes to Persian messages
      let errorMessage = "خطا در ایجاد درخواست پرداخت";
      if (zarinpalResult.errors && zarinpalResult.errors.length > 0) {
        errorMessage = zarinpalResult.errors[0].message;
      } else if (zarinpalResult.data?.code) {
        const errorCode = zarinpalResult.data.code;
        const errorMessages: Record<number, string> = {
          [-9]: "خطای اعتبار سنجی",
          [-10]: "IP یا مرچنت غیرفعال",
          [-11]: "درخواست کننده معتبر نیست",
          [-12]: "امکان انجام تراکنش وجود ندارد",
          [-15]: "مبلغ پرداخت صحیح نیست",
          [-16]: "سطح تأیید پذیرنده کافی نیست",
        };
        errorMessage = errorMessages[errorCode] || `خطای ${errorCode}`;
      }

      return NextResponse.json(
        {
          success: false,
          error: "خطا در ایجاد درخواست پرداخت",
          message: errorMessage,
          code: zarinpalResult.data?.code,
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
