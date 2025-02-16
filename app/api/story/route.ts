import Story from "../../../models/story";
import { NextResponse } from "next/server";
import connect from "@/lib/data";
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

    if (!storeId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const stories = await Story.find({ storeId: storeId });
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories" });
  }
}
