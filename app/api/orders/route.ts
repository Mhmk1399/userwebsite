import { NextResponse } from 'next/server'
import connect from '@/lib/data'
import Order from '@/models/orders'


export async function POST(req: Request) {
  await connect();
  if (!connect)
    return NextResponse.json({ error: "Database connection error" }, { status: 500 })
  try {
    const body = await req.json()
    const order = new Order(body)
    await order.save()
    return NextResponse.json({ message: "Order created successfully" }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
export async function GET(req: Request) {
  await connect();
  if (!connect)
    return NextResponse.json({ error: "Database connection error" }, { status: 500 })
  try {
    const orders = await Order.find()
    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}