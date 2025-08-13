import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { authority, amount } = await request.json();

    const verifyData = {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: Math.round(amount),
      authority
    };

    const response = await fetch("https://payment.zarinpal.com/pg/v4/payment/verify.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(verifyData)
    });

    const result = await response.json();

    if (result.data?.code === 100 || result.data?.code === 101) {
      return NextResponse.json({
        success: true,
        verified: result.data.code === 100,
        already_verified: result.data.code === 101,
        ref_id: result.data.ref_id,
        card_pan: result.data.card_pan
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Payment verification failed"
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
  }
}