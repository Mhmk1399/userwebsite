import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Order from "@/models/orders";
import "@/lib/types";
import { getStoreId } from "@/utils/getStoreId";

export async function POST(request: NextRequest) {
  try {
    const { authority } = await request.json();

    if (!authority) {
      return NextResponse.json(
        {
          success: false,
          message: "Authority is required",
        },
        { status: 400 }
      );
    }

    // Retrieve stored order data
    const pendingOrder = (
      (global as Record<string, unknown>).pendingOrders as Map<string, unknown>
    )?.get(authority) as Record<string, unknown> | undefined;

    if (!pendingOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found or expired",
        },
        { status: 400 }
      );
    }

    // Check if order has expired
    if (new Date() > (pendingOrder.expiresAt as Date)) {
      (
        (global as Record<string, unknown>).pendingOrders as Map<
          string,
          unknown
        >
      )?.delete(authority);
      return NextResponse.json(
        {
          success: false,
          message: "Order has expired",
        },
        { status: 400 }
      );
    }

    const verifyData = {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: pendingOrder.paymentAmount,
      authority,
    };

    const response = await fetch(
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

    const result = await response.json();

    if (result.data?.code === 100 || result.data?.code === 101) {
      await connect();
      const storeId = getStoreId();

      // Extract only the fields needed for Order model
      const orderData = {
        userId: pendingOrder.userId,
        products: pendingOrder.products,
        totalAmount: pendingOrder.totalAmount,
        shippingAddress: pendingOrder.shippingAddress,
        status: "processing",
        paymentStatus: "completed",
        storeId: storeId,
      } as Record<string, unknown>;

      const order = await Order.create(orderData);

      // Clean up pending order
      (
        (global as Record<string, unknown>).pendingOrders as Map<
          string,
          unknown
        >
      )?.delete(authority);

      return NextResponse.json({
        success: true,
        verified: result.data.code === 100,
        already_verified: result.data.code === 101,
        ref_id: result.data.ref_id,
        card_pan: result.data.card_pan,
        order: {
          id: order._id,
          totalAmount: order.totalAmount,
          products: order.products,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed",
          zarinpalCode: result.data?.code,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Payment verification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: (error as Error)?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
