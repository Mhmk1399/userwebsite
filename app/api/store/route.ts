import connect from "@/lib/data";
import { NextResponse } from "next/server";
import Products from "../../../models/product";
import { getStoreId } from "../../../middleWare/storeId";

export async function GET() {
  try {
    await connect();
    const storeId = await getStoreId();
    console.log(storeId, "storeId");

    const products = await Products.find().populate("category");
    
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}
