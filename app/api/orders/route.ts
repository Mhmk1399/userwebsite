import { NextResponse } from "next/server";
import Order from "@/models/orders";
import connect from "@/lib/data";

// CREATE Order
export async function POST(req: Request) {
    await connect();
    if (!connect) {
        return NextResponse.json({ error: "Connection failed!" });
    }

    const body = await req.json();
    if (!body) {
        return NextResponse.json({ error: "Data is required" }, { status: 400 });
    }
    try {
        const order = await Order.create(body);
        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}

// GET All Orders
export async function GET() {
    await connect();
    if (!connect) {
        return NextResponse.json({ error: "Connection failed!" });
    }
    try {

        const orders = await Order.find()
            .populate('userId')
            .populate('products.productId');
        return NextResponse.json(orders);
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
