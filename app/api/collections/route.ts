import connect from "@/lib/data";
import { getStoreId } from "@/middleWare/storeId";
import { NextRequest, NextResponse } from "next/server";
import Collections from "@/models/collection";
export async function GET(req: NextRequest) {
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
     return NextResponse.json(
       {    error: "Failed to fetch collections" },
       { status: 500 }
       );
    }
}