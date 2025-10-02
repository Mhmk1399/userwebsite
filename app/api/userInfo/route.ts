import connect from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import UserInfo from "@/models/userInfo";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET() {
  try {
    await connect();

    const storeId = process.env.STOREID;

    if (!storeId) {
      return NextResponse.json(
        { error: "Store ID not configured" },
        { status: 500 }
      );
    }

    const userInfo = await UserInfo.findOne({ storeId });

    if (!userInfo) {
      return NextResponse.json(
        { error: "User info not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(userInfo, { status: 200 });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      { message: "Error fetching user info" },
      { status: 500 }
    );
  }
}
