import connect from "@/lib/data";
import Order from "@/models/orders";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connect();
  if (!connect) {
    return NextResponse.json({ error: "Connection failed!" });
  }
  
  const { orderId } = await request.json();
  
  if (!orderId) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  try {
    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.log("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
