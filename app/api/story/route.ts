import Story from "../../../models/story";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import { GetStoreId } from "../../api/test/route";

export async function GET(req: NextRequest) {
  try {
    await connect();
    console.log("Connected to MongoDB");
    if (!connect) {
      return NextResponse.json({ error: "Failed to connect to database" });
    }

    const storeId = GetStoreId();
    console.log("Store ID:", storeId);
    
    if (!storeId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const stories = await Story.find();
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories" });
  }
}
