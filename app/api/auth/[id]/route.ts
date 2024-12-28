import StoreUsers from "../../../../models/storesUsers";
import connect from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  if (!connect) {
    return NextResponse.json({ error: "Connection failed!" });
  }
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }
    const user = await StoreUsers.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Error deleting user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  if (!connect) {
    return NextResponse.json({ error: "Connection failed!" });
  }
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }
    const { name, phone, password } = await request.json();

    const user = await StoreUsers.findByIdAndUpdate(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.name = name;
    user.phone = phone;
    user.password = hashedPassword;
    await user.save();
    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }
  await connect();

  try {
    const user = await StoreUsers.findById(id);

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new NextResponse("Error fetching user", { status: 500 });
  }
}
