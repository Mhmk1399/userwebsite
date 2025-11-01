import connect from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import collections from "@/models/collection";
import products from "@/models/product";
import { ProductCardData } from "@/lib/types";
import { getStoreId } from "@/utils/getStoreId";

export async function GET(req: NextRequest) {
  await connect();
  const collectionId = req.headers.get("CollectionId");
  const storeId = getStoreId(req);

  try {
    // Find collection by ID and storeId
    const collection = await collections.findOne({
      _id: collectionId,
      storeId: storeId,
    });

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    // Get actual product data from Products collection
    const productIds = collection.products
      .map((p: ProductCardData) => p._id)
      .filter(Boolean);

    if (productIds.length > 0) {
      const actualProducts = await products.find({
        _id: { $in: productIds },
        storeId: storeId,
      });

      return NextResponse.json(
        {
          ...collection.toObject(),
          products: actualProducts,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        ...collection.toObject(),
        products: [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Detailed error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection", details: error },
      { status: 500 }
    );
  }
}
