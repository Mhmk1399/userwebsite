import {  NextResponse } from "next/server";
import connect from "@/lib/data";
import Blog from "@/models/blogs";
import { getStoreId } from "@/middleWare/storeId";


export const GET = async () => {
  await connect();
  if (!connect) {
    return new NextResponse("Database connection error", { status: 500 });
  }

  try {
    const sotreId = await getStoreId();

    if (!sotreId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const blogs = await Blog.find();
    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error logging in", error },
      { status: 500 }
    );
  }
};
