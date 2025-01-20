import connect from "@/lib/data";
import { getStoreId } from "@/middleWare/storeId";
import {  NextResponse } from "next/server";
import Collections from "@/models/collection";
export async function GET() {
   await connect();
   if (!connect) {
     return NextResponse.json({ error: "Connection failed!" });
   }
   const storeId= getStoreId();
   console.log(storeId);
   try {
     const collection = await Collections.find({ storeId });
     return NextResponse.json(collection, { status: 200 });
   } catch (error) {
    console.log(error);
     return NextResponse.json(
       {    error: "Failed to fetch collections" },
       { status: 500 }
       );
    }
}