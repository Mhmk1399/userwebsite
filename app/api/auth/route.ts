import { NextResponse } from "next/server";
import connect from "@/lib/data";
import User from "../../../models/storesUsers";
import bcrypt from "bcryptjs";

// const jwt = require("jsonwebtoken");

export async function GET(request: Request) {
  await connect();
  if (!connect) {
    return NextResponse.json({ error: "Connection failed!" });
  }
  try {
    const users = await User.find();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await connect();
  if (!connect) {
    return NextResponse.json({ error: "Connection failed!" });
  }
  try {
    const { name, phone, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      phone,
      password: hashedPassword,
    });
    await newUser.save();
    return NextResponse.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
}
