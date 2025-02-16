import connect from "@/lib/data";
import { NextResponse } from "next/server";
import Products from "../../../models/product";
import StoreConfig from "../../../store-config.json";

export async function GET() {
  try {
    await connect();

    const storeId = StoreConfig.storeId;
    if (!storeId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
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
