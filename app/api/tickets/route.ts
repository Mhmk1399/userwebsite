import { NextRequest, NextResponse } from "next/server";
import  connect from "@/lib/data";
import CustomerTicket from "@/models/customerTicket";
import jwt from "jsonwebtoken";
import StoreUsers from "@/models/storesUsers";
import { getStoreId } from "@/utils/getStoreId";

export async function GET(request: NextRequest) {
  try {
    await connect();
    
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "توکن احراز هویت مورد نیاز است" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    const tickets = await CustomerTicket.find({ customer: userId , })
      .populate({
        path:"customer",
        model:StoreUsers
      })
      .sort({ updatedAt: -1 });

    return NextResponse.json({ tickets });
  } catch {
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "توکن احراز هویت مورد نیاز است" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId 
    console.log("Decoded token:", decoded);
    console.log("User ID:", userId);
   
    if (!userId) {
      return NextResponse.json({ message: "شناسه کاربر یافت نشد" }, { status: 401 });
    }
     const storeId = getStoreId(request);
 
    const { subject, content, priority } = await request.json();

    if (!subject || !content) {
      return NextResponse.json({ message: "موضوع و محتوا الزامی است" }, { status: 400 });
    }
    const ticket = new CustomerTicket({
      customer: userId,
      subject,
      priority: priority || "medium",
      messages: [{
        sender: "customer",
        content,
        timestamp: new Date()
      }],
      storeId: storeId
    });
    console.log(ticket,"tiket")

    const savedTicket = await ticket.save();
    console.log("Ticket saved successfully");
    
    const populatedTicket = await CustomerTicket.findById(savedTicket._id).populate("customer", "name phone");
    console.log("Ticket populated successfully");

    return NextResponse.json({ ticket: populatedTicket }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/tickets:", error);
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}