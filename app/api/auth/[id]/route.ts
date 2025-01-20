import StoreUsers from "../../../../models/storesUsers";
import connect from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();

  try {
    const id = request.nextUrl.pathname.split('/')[3];
    const user = await StoreUsers.findById(id);
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  await connect();
  
  try {
    const id = request.nextUrl.pathname.split('/')[3];
    const user = await StoreUsers.findByIdAndDelete(id);
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error deleting user" }, { status: 500 });
  }
}
