import { NextResponse } from "next/server";
import connect from "@/lib/data";
import Blog from "@/models/blogs";


export const GET = async (request: Request) => {
  await connect();
  if (!connect) {
    return new NextResponse("Database connection error", { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const skip = (page - 1) * limit;

    const storeId = process.env.STOREID;
    if (!storeId) {
      return NextResponse.json({ error: "Storeid is empty" }, { status: 401 });
    }

    const [blogs, total] = await Promise.all([
      Blog.find({ storeId: storeId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Blog.countDocuments({ storeId: storeId })
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ 
      blogs, 
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error logging in", error },
      { status: 500 }
    );
  }
};
