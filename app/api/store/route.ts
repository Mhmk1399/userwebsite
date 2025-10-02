// app/api/store/route.ts
import connect from "@/lib/data";
import { NextResponse } from "next/server";
import Products from "../../../models/product";
import Category from "../../../models/category";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    await connect();

    const storeId = process.env.STOREID;
    if (!storeId) {
      return NextResponse.json({ error: "Storeid is empty" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const category = searchParams.get("category");
    const colors = searchParams.get("colors");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const sortBy = searchParams.get("sortBy") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const matchQuery: Record<string, unknown> = { storeId: storeId };

    // Category filter
    if (categoryId) {
      matchQuery.category = new mongoose.Types.ObjectId(categoryId);
    } else if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        matchQuery.category = new mongoose.Types.ObjectId(category);
      } else {
        const catDoc = await Category.findOne({
          name: category,
          storeId: storeId,
        });
        if (catDoc) {
          matchQuery.category = catDoc._id;
        } else {
          return NextResponse.json({
            products: [],
            totalPages: 0,
            totalProducts: 0,
            currentPage: page,
          });
        }
      }
    }

    // Color filter
    if (colors) {
      const colorArray = colors.split(",");
      matchQuery["colors.code"] = { $in: colorArray };
    }

    // Build aggregation pipeline
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipeline: any[] = [
      { $match: matchQuery },
      // Convert price to number for filtering and sorting
      {
        $addFields: {
          numPrice: {
            $convert: {
              input: "$price",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
    ];

    // Price filter - only add if values are provided
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const priceFilters: any[] = [];
    if (priceMin) {
      priceFilters.push({ $gte: ["$numPrice", parseFloat(priceMin)] });
    }
    if (priceMax) {
      priceFilters.push({ $lte: ["$numPrice", parseFloat(priceMax)] });
    }

    if (priceFilters.length > 0) {
      pipeline.push({
        $match: {
          $expr: {
            $and: priceFilters,
          },
        },
      });
    }

    // Sort
    let sortObj: Record<string, number>;
    switch (sortBy) {
      case "price-asc":
        sortObj = { numPrice: 1 };
        break;
      case "price-desc":
        sortObj = { numPrice: -1 };
        break;
      case "name":
        sortObj = { name: 1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    // Count total products
    const countPipeline = [...pipeline, { $count: "total" }];
    const totalRes = await Products.aggregate(countPipeline);
    const totalProductsCount = totalRes[0]?.total || 0;
    const totalPages = Math.ceil(totalProductsCount / limit);

    // Add sorting, pagination, and category lookup
    pipeline.push(
      { $sort: sortObj },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Clean up the response
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          description: 1,
          images: 1,
          colors: 1,
          sizes: 1,
          category: "$categoryData",
          createdAt: 1,
          updatedAt: 1,
          storeId: 1,
          // Include other fields you need
        },
      }
    );

    const products = await Products.aggregate(pipeline);

    return NextResponse.json(
      {
        products,
        totalPages,
        totalProducts: totalProductsCount,
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}
