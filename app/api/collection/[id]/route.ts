import { NextRequest, NextResponse } from "next/server";
import Collections from "@/models/collection";
import connect from "@/lib/data";
import product from "@/models/product";

export async function GET(request: NextRequest) {
  const collectionId = request.nextUrl.pathname.split("/")[3];

  await connect();
  try {
    const collection = await Collections.findById(collectionId).populate({
       path: "products",
       model:product
      });
    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}
