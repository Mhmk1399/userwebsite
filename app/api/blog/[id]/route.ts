import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Blog from "@/models/blogs";
import { getStoreId } from "@/middleWare/storeId";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await connect();
  if (!connect) {
    return new NextResponse("Database connection error", { status: 500 });
  }

  try {
    const storeId = await getStoreId();
    if (!storeId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Find the specific blog by its _id and storeId
    const blog = await Blog.findOne({
      _id: params.id,
      storeId: storeId,
    });

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ blog }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching blog", error },
      { status: 500 }
    );
  }
};
