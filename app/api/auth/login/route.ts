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
      console.log("JWT_SECRET is not defined");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }
    const token = jwt.sign(
      { userId: user._id, storeId: user.storeId, name: user.name, phone: user.phone, role: user.role || 'user'},
      jwtSecret,
      {
        expiresIn: "10h",
      }
    );
    
    const response = NextResponse.json({
      token,
      userId: user._id,
      message: "Login successful",
    });
    
    // Set secure HTTP-only cookie (optional, for additional security)
    response.cookies.set('tokenUser', token, {
      httpOnly: false, // Set to true for production for better security
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 10 * 60 * 60, // 10 hours
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ message: "Error logging in" }, { status: 500 });
  }
}
