import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/orders";
import connect from "@/lib/data";
import { getStoreId } from "../../../middleWare/storeId";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  status: string;
}

export async function POST(req: Request) {
  await connect();
  if (!connect) {
    return NextResponse.json({ error: "Connection failed!" });
  }

  const body = await req.json();
  if (!body) {
    return NextResponse.json({ error: "Data is required" }, { status: 400 });
  }
const token = req.headers.get("Authorization")?.split(" ")[1];
console.log("Received token:", token);

if (!token) {
  return NextResponse.json({ message: "No token provided" }, { status: 401 });
}

  try {
    const storeId = getStoreId();
    const orderData = { ...body, storeId };
    console.log("Order Data:", orderData);
    const order = await Order.create(orderData);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.log("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  await connect();
  if (!connect) {
    return NextResponse.json({ error: "Connection failed!" });
  }

  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "No authorization token provided" },
        { status: 401 }
      );
    }
    console.log("Token:", token);
    
    const verifiedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;

    const userId = verifiedToken.userId;
    // Query directly with userId filter instead of fetching all orders first
    const orders = await Order.find({ userId: userId });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.log("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// Compare this snippet from app/api/orders/route.ts:
