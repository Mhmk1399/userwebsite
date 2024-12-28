import connect from "@/lib/data";
import { NextResponse } from "next/server";
import Products from "../../../../models/product";
import { getStoreId } from "../../../../middleWare/storeId";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const storeId = getStoreId();
    const productId = params.id;
    const product = await Products.findOne({ storeId, _id: productId });
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Error fetching product" },
      { status: 500 }
    );
  }
}
