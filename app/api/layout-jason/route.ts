import connect from "@/lib/data";
import { NextRequest , NextResponse } from "next/server";
import Jsons from "@/models/jsons";
import { getStoreId } from "@/utils/getStoreId";

export async function GET(request: NextRequest) {
  await connect();
  const storeId = getStoreId(request);

  try {
    const routeName = request.headers.get("selectedRoute") || "home";
    const activeMode = request.headers.get("activeMode") || "lg";

    console.log(routeName, "routeName")
    console.log(activeMode, "activeMode")


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

    if (routeName === "home") {
      const homeDoc = await Jsons.findOne({ storeId, route: "home" });
      if (!homeDoc) {
        return NextResponse.json({ error: "Home content not found" }, { status: 404 });
      }
      const homeContent = activeMode === "lg" ? homeDoc.lgContent : homeDoc.smContent;
      return NextResponse.json(homeContent, { status: 200, headers });
    }

    try {
      const [routeDoc, homeDoc] = await Promise.all([
        Jsons.findOne({ storeId, route: routeName }),
        Jsons.findOne({ storeId, route: "home" })
      ]);

      if (!routeDoc || !homeDoc) {
        return NextResponse.json({ error: "Content not found" }, { status: 408 });
      }

      const routeContent = activeMode === "lg" ? routeDoc.lgContent : routeDoc.smContent;
      const homeContent = activeMode === "lg" ? homeDoc.lgContent : homeDoc.smContent;

      const layout = {
        sections: {
          sectionHeader: homeContent?.sections?.sectionHeader,
          children: routeContent.children,
          sectionFooter: homeContent?.sections?.sectionFooter,
        },
      };

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

