import connect from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import collections from "@/models/collection";

export async function GET(req: NextRequest) {
  await connect();
  const collectionId = req.headers.get("CollectionId");

  try {
    const collection = await collections.findById(collectionId);
    
    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    
    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    console.log("Detailed error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection", details: error },
      { status: 500 }
    );
  }
}
