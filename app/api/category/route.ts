import connect from "@/lib/data";
import Category from "@/models/category";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    await connect();
    console.log("Connected to MongoDB");
    if (!connect) {
      return NextResponse.json({ error: "Failed to connect to database" });
    }
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


    if (!storeId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    const categories = await Category.find({storeId:storeId}).populate("children");

    return NextResponse.json(categories);
    
 
    
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}
