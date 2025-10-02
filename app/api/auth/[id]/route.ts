import StoreUsers from "../../../../models/storesUsers";
import connect from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/middleWare/verifyToken";

export async function GET(request: NextRequest) {
  await connect();

  try {
    // Validate token and get user info
    const authResult = await validateRequest(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    const id = request.nextUrl.pathname.split('/')[3];
    
    // Ensure user can only access their own data
    if (authResult.userId !== id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const user = await StoreUsers.findById(id).select('-password');
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  await connect();
  
  try {
    // Validate token and get user info
    const authResult = await validateRequest(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const id = request.nextUrl.pathname.split('/')[3];
    
    // Ensure user can only update their own data
    if (authResult.userId !== id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { name, phone } = await request.json();
    
    const updatedUser = await StoreUsers.findByIdAndUpdate(
      id,
      { name, phone },
      { new: true, select: '-password' }
    );
    
    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error updating user" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  await connect();
  
  try {
    // Validate token and get user info
    const authResult = await validateRequest(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const id = request.nextUrl.pathname.split('/')[3];
    
    // Ensure user can only delete their own account
    if (authResult.userId !== id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    
    const user = await StoreUsers.findByIdAndDelete(id);
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error deleting user" }, { status: 500 });
  }
}
