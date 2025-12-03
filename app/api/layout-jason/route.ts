import connect from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import Jsons from "@/models/jsons";
// import path from "path";
// import fs from "fs/promises";

export async function GET(request: NextRequest) {
  await connect();
  const storeId =process.env.STORE_ID;  
  console.log("URL:", request.url);
  console.log("Hostname:", new URL(request.url).hostname);
  console.log("storeId extracted:", storeId);

  try {
    const routeName = request.headers.get("selectedRoute") || "home";
    const activeMode = request.headers.get("activeMode") || "lg";

    if (!routeName || !activeMode) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }


    if (routeName === "home") {
      const homeDoc = await Jsons.findOne({ storeId, route: "home" });

      // Debug: Check what store IDs exist in database
      const allDocs = await Jsons.find({}, { storeId: 1, route: 1 }).limit(5);

      console.log(allDocs)

      if (!homeDoc) {
        return NextResponse.json(
          { error: `Home content not found for storeId: ${storeId}` },
          { status: 404 }
        );
      }
      const homeContent =
        activeMode === "lg" ? homeDoc.lgContent : homeDoc.smContent;
      return NextResponse.json(homeContent, { status: 200 });
    }

    try {
      const [routeDoc, homeDoc] = await Promise.all([
        Jsons.findOne({ storeId, route: routeName }),
        Jsons.findOne({ storeId, route: "home" }),
      ]);

      if (!routeDoc || !homeDoc) {
        return NextResponse.json(
          { error: "Content not found" },
          { status: 404 }
        );
      }

      const routeContent =
        activeMode === "lg" ? routeDoc.lgContent : routeDoc.smContent;
      const homeContent =
        activeMode === "lg" ? homeDoc.lgContent : homeDoc.smContent;

      const layout = {
        sections: {
          sectionHeader: homeContent?.sections?.sectionHeader,
          children: routeContent.children,
          sectionFooter: homeContent?.sections?.sectionFooter,
        },
      };

      return NextResponse.json(layout, { status: 200 });
    } catch (error) {
      console.log("Error fetching content:", error);
      return NextResponse.json(
        { error: "Failed to fetch route content" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// export async function GET(request: NextRequest) {
//   await connect();

//   try {
//     const routeName = request.headers.get("selectedRoute");
//     const activeMode = request.headers.get("activeMode") || "lg";
//     // const storeId = getStoreIdFromRequest(request);

//     if (!routeName || !activeMode) {
//       return NextResponse.json(
//         { error: "Missing required parameters" },
//         { status: 400 }
//       );
//     }

//     const getFilename = (routeName: string) => `${routeName}${activeMode}`;

//     console.log(routeName, "routename");
//     console.log(activeMode, "activeMode");
//     console.log(getFilename(routeName), "filename");

//     // Resolve the path to the JSON files in the public/template directory
//     const basePath = path.join(process.cwd(), "public", "template");
//     console.log(getFilename("home"), " filename");

//     if (routeName === "home") {
//       const filePath = path.join(basePath, `home${activeMode}.json`);
//       try {
//         const homeContent = JSON.parse(await fs.readFile(filePath, "utf-8"));
//         return NextResponse.json(homeContent, { status: 200 });
//       } catch (error) {
//         console.log(`Error reading ${filePath}:`, error);
//         return NextResponse.json(
//           { error: `Failed to fetch home${activeMode} content` },
//           { status: 404 }
//         );
//       }
//     }

//     try {
//       const routeFilePath = path.join(
//         basePath,
//         `${routeName}${activeMode}.json`
//       );
//       const homeFilePath = path.join(basePath, `home${activeMode}.json`);

//       const routeContent = JSON.parse(
//         await fs.readFile(routeFilePath, "utf-8")
//       );
//       const homeContent = JSON.parse(await fs.readFile(homeFilePath, "utf-8"));

//       const layout = {
//         sections: {
//           sectionHeader: homeContent.sections.sectionHeader,
//           children: routeContent.children,
//           sectionFooter: homeContent.sections.sectionFooter,
//         },
//       };

//       return NextResponse.json(layout, { status: 200 });
//     } catch (error) {
//       console.log("Error fetching content:", error);
//       return NextResponse.json(
//         { error: "Failed to fetch route content" },
//         { status: 404 }
//       );
//     }
//   } catch (error) {
//     console.log("Error processing request:", error);
//     return NextResponse.json(
//       { error: "Failed to process request" },
//       { status: 500 }
//     );
//   }
// }
