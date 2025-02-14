import { NextResponse } from "next/server";
import connect from "@/lib/data";
import StoreUsers from "../../../models/storesUsers";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";


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
    const configPath = path.join(process.cwd(), 'store-config.json');
    const configFile = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configFile);
    const storeId = config.storeId;
    
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
