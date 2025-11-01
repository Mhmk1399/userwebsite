import connect from "@/lib/data";
import Category from "@/models/category";
import { NextResponse, NextRequest } from "next/server";
import { getStoreId } from "@/utils/getStoreId";


export async function GET(request: NextRequest) {
  try {
    await connect();
    console.log("Connected to MongoDB");
    if (!connect) {
      return NextResponse.json({ error: "Failed to connect to database" });
    }
        const storeId = getStoreId();

          console.log("storeId read from subdomain", storeId);
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
