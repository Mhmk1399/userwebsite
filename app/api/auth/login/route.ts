import connect from "@/lib/data";
import StoreUsers from "@/models/storesUsers";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  await connect();
  if (!connect) {
    return NextResponse.json({ error: "Connection failed!" });
  }
  try {
    const { phone, password } = await request.json();
    const user = await StoreUsers.findOne({ phone });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign(
      { userId: user._id, storeId: user.storeId },
      jwtSecret,
      {
        expiresIn: "10h",
      }
    );
    console.log(token, "token");
    const decodedToken = jwt.decode(token) as { userId: string; storeId: string };
    console.log(decodedToken, "decodedToken");
    return NextResponse.json({
      token,
      userId:decodedToken.userId,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ message: "Error logging in" }, { status: 500 });
  }
}
