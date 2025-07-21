import connect from "@/lib/data";
import { fetchFromStore } from "@/services/fetchFiles";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connect();

  try {
    const routeName = request.headers.get("selectedRoute");
    const activeMode = request.headers.get("activeMode") || "lg";
    const storeId = request.headers.get("storeId") || "storemdbrstve5d4941"; // You can add this header client-side

    if (!routeName || !activeMode || !storeId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const headers = {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    };

    const getFilename = (name: string) => `${name}${activeMode}.json`;
    // console.log(routeName, activeMode);

    // Home route
    if (routeName === "home") {
      const homeContent = JSON.parse(
        await fetchFromStore(getFilename("home"), storeId)
      );

      return NextResponse.json(homeContent, { status: 200, headers });
    }

    try {
      const routeContent = JSON.parse(
        await fetchFromStore(getFilename(routeName), storeId)
      );
      console.log(routeName, "routeName");
      const homeContent = JSON.parse(
        await fetchFromStore(getFilename("home"), storeId)
      );
      console.log(homeContent, "homeContent");

      const layout = {
        sections: {
          sectionHeader: homeContent?.sections?.sectionHeader,
          children: routeContent.children,
          sectionFooter: homeContent?.sections?.sectionFooter,
        },
      };

      // console.log(layout, "layout");

      return NextResponse.json(layout, { status: 200, headers });
    } catch (error) {
      console.error("Error fetching content:", error);
      return NextResponse.json(
        { error: "Failed to fetch route content" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
