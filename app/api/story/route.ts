import Story from "../../../models/story";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import { getStoreId } from "@/utils/getStoreId";


export async function GET(request:NextRequest) {
  try {
    await connect();
    console.log("Connected to MongoDB");
    if (!connect) {
      return NextResponse.json({ error: "Failed to connect to database" });
    }

    const storeId = getStoreId(request);
    if (!storeId) {
      return NextResponse.json({ error: "Storeid is empty" }, { status: 401 });
    }
    const stories = await Story.find({ storeId: storeId });
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories" });
  }
}
