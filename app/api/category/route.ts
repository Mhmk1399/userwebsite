import connect from "@/lib/data";
import Category from "@/models/category";
import { NextResponse } from "next/server";
import StoreConfig from "../../../store-config.json";

export async function GET() {
  try {
    await connect();
    console.log("Connected to MongoDB");
    if (!connect) {
      return NextResponse.json({ error: "Failed to connect to database" });
    }
    const storeId = StoreConfig.storeId;
    if (!storeId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const categories = await Category.find({ storeId: storeId }).populate(
      "children"
    );
    console.log("Found categories:", categories.length); // Debug log

    return NextResponse.json(categories);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}
