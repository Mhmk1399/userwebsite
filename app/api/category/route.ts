import connect from "@/lib/data";
import Category from "@/models/category";
import { getStoreId } from "../../../middleWare/storeId";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connect();
    console.log("Connected to MongoDB");
    if (!connect) {
      return NextResponse.json({ error: "Failed to connect to database" });
    }
    console.log(req);
    
    const storeId = await getStoreId();

    if (!storeId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    const categories = await Category.find({storeId:storeId}).populate("children");

    return NextResponse.json(categories);
    
 
    
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}
