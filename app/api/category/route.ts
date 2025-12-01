import connect from "@/lib/data";
import Category from "@/models/category";
import { NextResponse,   } from "next/server";


export async function GET() {
  try {
    await connect();
    if (!connect) {
      return NextResponse.json({ error: "Failed to connect to database" });
    }
    const storeId = process.env. STORE_ID;
    if (!storeId) {
      return NextResponse.json({ error: "Miss storeId" }, { status: 401 });
    }

    const categories = await Category.find({ storeId: storeId }).populate(
      "children"
    );

    return NextResponse.json(categories);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}
