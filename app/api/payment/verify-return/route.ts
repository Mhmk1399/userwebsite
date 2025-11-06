import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Order from "@/models/orders";

/**
 * Payment Return Verification Endpoint
 * 
 * This endpoint is called by the payment return page to verify the return token
 * and update the order status in the database.
 */
export async function POST(request: NextRequest) {
  try {
    console.log('=== Payment Return Verification Started ===');
    const { returnToken } = await request.json();

    if (!returnToken) {
      console.log('ERROR: No return token provided');
      return NextResponse.json(
        {
          success: false,
          message: "Return token is required",
        },
        { status: 400 }
      );
    }

    // Call vendor dashboard API to verify return token
    const VENDOR_DASHBOARD_URL = process.env.VENDOR_DASHBOARD_URL;
    if (!VENDOR_DASHBOARD_URL) {
      console.log('ERROR: VENDOR_DASHBOARD_URL not configured');
      return NextResponse.json(
        {
          success: false,
          message: "Vendor dashboard URL not configured",
        },
        { status: 500 }
      );
    }

    console.log('Calling vendor dashboard to verify return token...');
    const verifyResponse = await fetch(
      `${VENDOR_DASHBOARD_URL}/api/vendor/verify-return`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ returnToken }),
      }
    );

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json().catch(() => ({}));
      console.log('ERROR: Vendor verification failed:', errorData);
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Token verification failed",
        },
        { status: verifyResponse.status }
      );
    }

    const verificationData = await verifyResponse.json();
    console.log('Verification response:', verificationData);

    if (!verificationData.success || !verificationData.verified) {
      console.log('ERROR: Token not verified:', verificationData);
      return NextResponse.json(
        {
          success: false,
          message: verificationData.message || "Token verification failed",
        },
        { status: 400 }
      );
    }

    // Extract verified payment data
    const {
      orderId,
      storeId,
      totalAmount,
      refId,
      authority,
      paymentStatus,
    } = verificationData;

    // Validate store ID matches
    if (storeId !== process.env.STORE_ID) {
      console.log('ERROR: Store ID mismatch:', { received: storeId, expected: process.env.STORE_ID });
      return NextResponse.json(
        {
          success: false,
          message: "Invalid store ID",
        },
        { status: 400 }
      );
    }

    // Connect to database and update order
    await connect();
    console.log('Connected to database, finding order:', orderId);

    const order = await Order.findById(orderId);
    if (!order) {
      console.log('ERROR: Order not found:', orderId);
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    // Check if order is already paid
    if (order.paymentStatus === "completed" && order.status === "paid") {
      console.log('Order already paid:', orderId);
      return NextResponse.json({
        success: true,
        verified: true,
        alreadyPaid: true,
        orderId,
        refId: order.paymentRefId,
        amount: order.totalAmount,
        message: "Order already paid",
      });
    }

    // Validate amount matches
    if (order.totalAmount !== totalAmount) {
      console.log('ERROR: Amount mismatch:', { orderAmount: order.totalAmount, paidAmount: totalAmount });
      return NextResponse.json(
        {
          success: false,
          message: "Amount mismatch",
        },
        { status: 400 }
      );
    }

    // Update order status
    order.status = paymentStatus === "success" ? "paid" : "failed";
    order.paymentStatus = paymentStatus === "success" ? "completed" : "failed";
    order.paymentRefId = refId;
    order.paymentAuthority = authority;
    if (paymentStatus === "success") {
      order.paidAt = new Date();
    }
    await order.save();

    console.log('Order updated successfully:', {
      orderId,
      status: order.status,
      paymentStatus: order.paymentStatus,
      refId,
    });

    return NextResponse.json({
      success: true,
      verified: true,
      orderId,
      refId,
      authority,
      amount: totalAmount,
      paymentStatus,
      message: paymentStatus === "success" ? "Payment verified successfully" : "Payment failed",
    });
  } catch (error) {
    console.log("=== CRITICAL ERROR in Payment Verification ===");
    console.log("Error type:", (error as Error)?.constructor?.name);
    console.log("Error message:", (error as Error)?.message);
    console.log("Error stack:", (error as Error)?.stack);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
