import { NextRequest, NextResponse } from "next/server";
import  connect from "@/lib/data";
import CustomerTicket from "@/models/customerTicket";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connect();
    const { id } = await params;
    
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "توکن احراز هویت مورد نیاز است" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.id || decoded._id;

    const ticket = await CustomerTicket.findOne({ 
      _id: id, 
      customer: userId 
    }).populate("customer", "name phone");

    if (!ticket) {
      return NextResponse.json({ message: "تیکت یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connect();
    const { id } = await params;
    
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "توکن احراز هویت مورد نیاز است" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId || decoded.userId;
    console.log("POST - Looking for ticket with ID:", id, "and customer:", userId);

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ message: "محتوا الزامی است" }, { status: 400 });
    }

    const ticket = await CustomerTicket.findOne({ 
      _id: id, 
      customer: userId 
    });

    if (!ticket) {
      return NextResponse.json({ message: "تیکت یافت نشد" }, { status: 404 });
    }

    ticket.messages.push({
      sender: "customer",
      content,
      timestamp: new Date()
    });

    if (ticket.status === "resolved" || ticket.status === "closed") {
      ticket.status = "open";
    }

    await ticket.save();
    await ticket.populate("customer", "name phone");

    return NextResponse.json({ ticket });
  } catch (error) {
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}