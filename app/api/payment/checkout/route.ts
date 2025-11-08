import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import connect from "@/lib/data";
import Product from "@/models/product";
import Order from "@/models/orders";
import { CartItem } from "@/lib/types";
import { generatePaymentToken, buildPaymentUrl } from "@/lib/payment";
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
    console.log("=== Vendor Dashboard Payment Request Started ===");
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
      console.log("Token verified, userId:", userId);
    } catch (error) {
      console.log("ERROR: Token verification failed:", error);
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
      console.log("ERROR: Invalid cart items:", {
        cartItems,
        isArray: Array.isArray(cartItems),
      });
      return NextResponse.json(
        {
          success: false,
          message: "Cart is empty",
        },
        { status: 400 }
      );
    }
    console.log("Cart validation passed, items count:", cartItems.length);

    // Connect to database and validate products
    console.log("Connecting to database...");
    await connect();
    console.log("Database connected successfully");

    let totalAmount = 0;
    const validatedItems: CartItem[] = [];
    const itemsWithNames: CartItem[] = [];

    for (const item of cartItems) {
      console.log("Processing cart item:", {
        productId: item.productId,
        quantity: item.quantity,
      });
      // Extract actual product ID from composite key (format: productId_#colorCode_{properties})
      const actualProductId = item.productId.split("_")[0];
      console.log("Extracted product ID:", actualProductId);
      const product = await Product.findById(actualProductId);
      if (!product) {
        console.log("ERROR: Product not found:", actualProductId);
        return NextResponse.json(
          {
            success: false,
            message: `Product not found: ${item.productId}`,
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
            message: `Invalid price for product: ${item.productId}`,
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

      // Store item with name for payment token
      const itemWithName: CartItem = {
        productId: actualProductId,
        name: product.name,
        quantity: item.quantity,
        price: serverPrice,
      };

      if (item.colorCode) {
        itemWithName.colorCode = item.colorCode;
      }

      if (validatedItem.properties) {
        itemWithName.properties = validatedItem.properties;
      }

      itemsWithNames.push(itemWithName);
    }
    console.log("All items validated. Total amount:", totalAmount, "Toman");

    // Create pending order in database
    const storeId = process.env.STORE_ID;
    if (!storeId) {
      console.log("ERROR: STORE_ID not configured");
      return NextResponse.json(
        {
          success: false,
          message: "Store configuration missing",
        },
        { status: 500 }
      );
    }

    const newOrder = await Order.create({
      userId,
      storeId,
      products: validatedItems,
      totalAmount,
      shippingAddress,
      status: "pending",
      paymentStatus: "pending",
    });

    console.log("Order created:", newOrder._id.toString());

    // Fetch user info from database for payment token
    let userInfo = {
      name: "Customer",
      email: "",
      phone: "0000000000",
    };

    try {
      const StoreUsers = (await import("@/models/storesUsers")).default;
      const user = await StoreUsers.findById(userId).select("name phone email");
      if (user) {
        userInfo = {
          name: user.name || "Customer",
          email: user.email || "",
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

    // Generate payment token for vendor dashboard
    try {
      const paymentToken = generatePaymentToken({
        orderId: newOrder._id.toString(),
        userId,
        items: itemsWithNames,
        totalAmount,
        customerName: userInfo.name,
        customerEmail: userInfo.email,
        customerPhone: userInfo.phone,
        shippingAddress,
      });

      console.log("Payment token generated successfully");

      // Build vendor dashboard URL
      const paymentUrl = buildPaymentUrl(paymentToken);
      console.log("Payment URL generated:", paymentUrl);

      return NextResponse.json({
        success: true,
        orderId: newOrder._id.toString(),
        paymentUrl,
        amount: totalAmount,
      });
    } catch (error) {
      console.log("ERROR: Token generation failed:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to generate payment token",
        },
        { status: 500 }
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
