import connect from "@/lib/data";
import Category from "@/models/category";
import { GetStoreId } from "@/utils/getStoreId";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connect();
    console.log("Connected to MongoDB");
    if (!connect) {
      return NextResponse.json({ error: "Failed to connect to database" });
    }
    console.log(req);

    // Call GetStoreId as a normal async function.
    const storeIdResult = await GetStoreId();

    // If GetStoreId returns a Response (indicating an error) handle it:
    if (storeIdResult instanceof Response) {
      return storeIdResult;
    }

    const storeId = storeIdResult;
    if (!storeId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const categories = await Category.find().populate("children");

    return NextResponse.json(categories);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}
