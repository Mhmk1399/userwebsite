import Story from "../../../models/story";
import {  NextResponse } from "next/server";
import connect from "@/lib/data";


export async function GET() {
  try {
    await connect();
    console.log("Connected to MongoDB");
    if (!connect) {
      return NextResponse.json({ error: "Failed to connect to database" });
    }

    const storeId = process.env. STORE_ID; if (!storeId) {
      return NextResponse.json({ error: "Storeid is empty" }, { status: 401 });
    }
    const stories = await Story.find({ storeId: storeId });
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories" });
  }
}
