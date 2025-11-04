import { NextResponse } from "next/server";
import connect from "@/lib/data";
import StoreUsers from "../../../models/storesUsers";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function GET() {
  await connect();
  if (!connect) {
    return NextResponse.json({ error: "Connection failed!" });
  }
  try {
    const users = await StoreUsers.find();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.log("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await connect();
  if (!connect) {
    return NextResponse.json({ error: "Connection failed!" });
  }

  try {
    const { name, phone, password } = await request.json();

    const storeId =process.env. STORE_ID;

    // Check if user already exists with this phone and storeId
    const existingUser = await StoreUsers.findOne({ phone, storeId });
    if (existingUser) {
      return NextResponse.json(
        { message: "کاربری با این شماره تلفن قبلاً ثبت نام کرده است" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new StoreUsers({
      name,
      storeId,
      phone,
      password: hashedPassword,
    });

    await newUser.save();
    return NextResponse.json(
      { newUser },
      { status: 201, statusText: "User created successfully" }
    );
  } catch (error) {
    console.log("Error creating user:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { message: "کاربری با این شماره تلفن قبلاً ثبت نام کرده است" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
}
