import { NextResponse } from 'next/server'
import connect from '@/lib/data'
import  Order  from '@/models/orders'


export async function POST (req: Request) {
    await connect();
    const body = await req.json()
    const order = new Order(body)
    await order.save()
    




    return new Response('Hello, Next.js!')
  }