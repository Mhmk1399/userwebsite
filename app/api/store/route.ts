import connect from "@/lib/data";
import { NextResponse } from "next/server";
import Products from "../../../models/product";

export async function GET() {
  try {
    await connect();

    const storeId = process.env.STOREID;
    if (!storeId) {
      return NextResponse.json({ error: "Storeid is empty" }, { status: 401 });
    }

    const products = await Products.find({ storeId: storeId }).populate(
      "category"
    );

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
