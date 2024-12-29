import connect from "@/lib/data";
import { NextResponse } from "next/server";
import Blog from "../../../../models/blogs";
import { getStoreId } from "../../../../middleWare/storeId";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const storeId = getStoreId();
    const blogId = params.id;
    const blog = await Blog.findOne({ storeId, _id: blogId });
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("Error fetching Blog:", error);
    return NextResponse.json(
      { message: "Error fetching Blog" },
      { status: 500 }
    );
  }
}
