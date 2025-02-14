import connect from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import Products from "../../../models/product";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    await connect();
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Invalid token format" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Token missing" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET!;
    const decodedToken = jwt.verify(token, secret) as { storeId: string };

    const storeId = decodedToken.storeId;
    console.log("Token:", token); // Add this for debugging
    console.log("Decoded:", decodedToken); // Add this for debugging

    const products = await Products.find({ storeId: storeId }).populate("category");

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
}
