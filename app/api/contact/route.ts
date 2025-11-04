import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Contact from "@/models/contact";

export const POST = async (req: NextRequest) => {
  await connect();
  try {
const storeId =process.env. STORE_ID;    if (!storeId) {
      return NextResponse.json({ error: "Storeid is empty" }, { status: 401 });
    }
    const body = await req.json();
    const { phone, name , message } = body;
    const contact = new Contact({
      storeId: storeId,
      phone: phone,
      name: name,
      message: message,
    });
    await contact.save();
    return NextResponse.json({ message: "Contact saved successfully" });
}catch (error) {
    return NextResponse.json(
      { message: "Error saving contact", error },{ status: 500 })
    }}