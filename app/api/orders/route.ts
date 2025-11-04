import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/orders";
import connect from "@/lib/data";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  status: string;
}

export async function POST(req: NextRequest) {
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
  const decodedToken = jwt.decode(token) as CustomJwtPayload;
  try {
    const storeId = process.env. STORE_ID;
    const orderData = { ...body, storeId, userId: decodedToken.userId };
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

    const verifiedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;

    const userId = verifiedToken.userId;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    // Build query filter
    const filter: Record<string, unknown> = { userId };
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filter);

    // Get orders with pagination
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNext: page < Math.ceil(totalOrders / limit),
        hasPrev: page > 1
      }
    }, { status: 200 });
  } catch (error) {
    console.log("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}


