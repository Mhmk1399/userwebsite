import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { amount, description, metadata } = await request.json();
    
    // Validate minimum amount (100 Toman = 1000 Rials)
    if (amount < 100) {
      return NextResponse.json({
        success: false,
        message: "حداقل مبلغ پرداخت 100 تومان است"
      }, { status: 400 });
    }
    
    console.log("Payment request data:", { amount, description, metadata });

    const paymentData = {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: Math.round(amount), // Amount should be in Rials (already converted from Toman)
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/verify`,
      description
    };
    
    console.log("Sending to Zarinpal:", paymentData);

    const response = await fetch("https://payment.zarinpal.com/pg/v4/payment/request.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();
    console.log("Zarinpal response:", result);

    if (result.data?.code === 100) {
      const paymentUrl = `https://payment.zarinpal.com/pg/StartPay/${result.data.authority}`;
      console.log("Generated payment URL:", paymentUrl);
      
      return NextResponse.json({
        success: true,
        authority: result.data.authority,
        paymentUrl
      });
    } else {
      console.error("Zarinpal error:", result);
      return NextResponse.json({
        success: false,
        message: result.errors?.[0]?.message || "Payment request failed",
        zarinpalResponse: result
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Payment request error:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}