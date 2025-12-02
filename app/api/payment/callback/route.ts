import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Order from "@/models/orders";

export async function GET(request: NextRequest) {
  try {
    console.log("=== ZarinPal Payment Callback Started ===");
    
    // Get fixed base URL from environment variable and normalize it
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001").replace(/\/$/, "");
    console.log("Using base URL for redirects:", baseUrl);
    
    const searchParams = request.nextUrl.searchParams;
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");

    console.log("Callback params:", { authority, status });

    // Validate authority parameter
    if (!authority) {
      console.log("ERROR: No authority provided");
      return NextResponse.redirect(
        `${baseUrl}/payment/failed?error=invalid_authority`
      );
    }

    // Check payment status
    if (status !== "OK") {
      console.log("Payment cancelled or failed by user");
      return NextResponse.redirect(
        `${baseUrl}/payment/failed?Authority=${authority}&Status=${status}`
      );
    }

    // Retrieve pending order data
    const pendingOrders = (global as Record<string, unknown>)
      .pendingOrders as Map<string, unknown>;
    
    if (!pendingOrders) {
      console.log("ERROR: No pending orders store found");
      return NextResponse.redirect(
        `${baseUrl}/payment/failed?error=session_expired`
      );
    }

    const orderData = pendingOrders.get(authority) as {
      userId: string;
      storeId: string;
      products: Array<{
        productId: string;
        quantity: number;
        price: number;
        name?: string;
        colorCode?: string;
        properties?: Array<{ name: string; value: string }>;
      }>;
      totalAmount: number;
      shippingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
      };
      status: string;
      paymentStatus: string;
      customerName: string;
      customerPhone: string;
      orderId: string;
      authority: string;
    };

    if (!orderData) {
      console.log("ERROR: Order data not found for authority:", authority);
      return NextResponse.redirect(
        `${baseUrl}/payment/failed?error=order_not_found`
      );
    }

    console.log("Order data retrieved:", {
      orderId: orderData.orderId,
      amount: orderData.totalAmount,
      authority: orderData.authority,
    });

    // Verify payment with ZarinPal
    console.log("Verifying payment with ZarinPal...");
    const verifyData = {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: orderData.totalAmount,
      authority,
    };

    const verifyResponse = await fetch(
      "https://payment.zarinpal.com/pg/v4/payment/verify.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(verifyData),
      }
    );

    console.log("ZarinPal verify response status:", verifyResponse.status);
    const verifyResult = await verifyResponse.json();
    console.log("ZarinPal verify result:", verifyResult);

    // Check verification result
    if (
      verifyResult.data?.code === 100 ||
      verifyResult.data?.code === 101
    ) {
      // Code 100: Successful verification
      // Code 101: Already verified
      const refId = verifyResult.data.ref_id;
      const cardPan = verifyResult.data.card_pan;

      console.log("Payment verified successfully:", {
        refId,
        cardPan,
        code: verifyResult.data.code,
      });

      // Connect to database and create order
      await connect();
      console.log("Database connected");

      // Create the order in database
      const newOrder = await Order.create({
        userId: orderData.userId,
        storeId: orderData.storeId,
        products: orderData.products,
        totalAmount: orderData.totalAmount,
        shippingAddress: orderData.shippingAddress,
        status: "pending", // Order status (pending, processing, shipped, delivered)
        paymentStatus: "completed", // Payment status
        paymentAuthority: authority,
        paymentRefId: refId,
        paymentCardPan: cardPan,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        createdAt: new Date(),
      });

      console.log("Order created successfully:", newOrder._id.toString());

      // Clear pending order from memory
      pendingOrders.delete(authority);

      // Redirect to success page
      return NextResponse.redirect(
        `${baseUrl}/payment/success?Authority=${authority}&Status=OK&RefID=${refId}&OrderID=${newOrder._id.toString()}`
      );
    } else {
      console.log("ERROR: Payment verification failed:", {
        code: verifyResult.data?.code,
        errors: verifyResult.errors,
      });

      // Clear pending order
      pendingOrders.delete(authority);

      // Map error codes to messages
      let errorMessage = "verify_failed";
      if (verifyResult.data?.code === -50) {
        errorMessage = "amount_mismatch";
      } else if (verifyResult.data?.code === -51) {
        errorMessage = "transaction_failed";
      }

      return NextResponse.redirect(
        `${baseUrl}/payment/failed?Authority=${authority}&Status=NOK&error=${errorMessage}`
      );
    }
  } catch (error) {
    console.log("=== CRITICAL ERROR in Payment Callback ===");
    console.log("Error type:", (error as Error)?.constructor?.name);
    console.log("Error message:", (error as Error)?.message);
    console.log("Error stack:", (error as Error)?.stack);

    // Get base URL for error redirect (fallback in case of early error)
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001").replace(/\/$/, "");

    return NextResponse.redirect(
      `${baseUrl}/payment/failed?error=server_error`
    );
  }
}
