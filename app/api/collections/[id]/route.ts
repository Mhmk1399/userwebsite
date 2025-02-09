import connect from "@/lib/data";
import {  NextRequest, NextResponse } from "next/server";
import Collections from "@/models/collection";
export async function GET(request: NextRequest) {
    const collectionId = request.nextUrl.pathname.split('/')[3];

   await connect();
   if (!connect) {
     return NextResponse.json({ error: "Connection failed!" });
   }
   try {
     const collection = await Collections.find({ _id: collectionId });
     return NextResponse.json(collection, { status: 200 });
   } catch (error) {
    console.log(error);
     return NextResponse.json(
       {    error: "Failed to fetch collections" },
       { status: 500 }
       );
    }
}