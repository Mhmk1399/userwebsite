import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import NewsLetter from "@/models/newsLetter";
import { getStoreId } from "@/utils/getStoreId";
export async function POST(request: NextRequest) {
  try {
    await connect();
    const { phoneNumber } = await request.json();
    const storeId = getStoreId(request);

    const newsletter = new NewsLetter({ storeId, phoneNumber });
    await newsletter.save();

    return NextResponse.json(newsletter, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create newsletter" },
      { status: 500 }
    );
  }
}
