import { NextResponse } from "next/server";
import connect from "@/lib/data";
import Blog from "@/models/blogs";
import StoreConfig from "../../../store-config.json";

export const GET = async () => {
  await connect();
  if (!connect) {
    return new NextResponse("Database connection error", { status: 500 });
  }

  try {
    const storeId = StoreConfig.storeId;
    if (!storeId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const blogs = await Blog.find({ storeId: storeId });
    if (!blogs) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error logging in", error },
      { status: 500 }
    );
  }
};
