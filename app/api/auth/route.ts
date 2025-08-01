import { NextResponse } from "next/server";
import connect from "@/lib/data";
import StoreUsers from "../../../models/storesUsers";
import bcrypt from "bcryptjs";



export async function GET() {
  await connect();
  if (!connect) {
    return NextResponse.json({ error: "Connection failed!" });
  }
  try {
    const users = await StoreUsers.find();
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
    
    // Read storeId from store-config.json
  
    const storeId = process.env.STOREID;
    
    console.log(storeId, "storeId");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new StoreUsers({
      name,
      storeId,
      phone,
      password: hashedPassword,
    });
    console.log(newUser);
    
    await newUser.save();
    return NextResponse.json({ newUser }, { status: 201, statusText: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
}
