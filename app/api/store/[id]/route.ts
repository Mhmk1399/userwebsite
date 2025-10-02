import connect from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import Products from "../../../../models/product";
import category from "@/models/category";

export async function GET(request: NextRequest) {
  try {
    await connect();
    const productId = request.nextUrl.pathname.split("/")[3];
 
    const product = await Products.findById(productId).populate({
      path:"category",
      model:category
    });
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching product" },
      { status: 500 }
    );
  }
}
