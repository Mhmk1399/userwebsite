import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { fetchGitHubFile } from "@/utils/githubFetcher";

export async function GET(request: Request) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);

    console.log("User Agent:", userAgent);

    const url = new URL(request.url);
    const routePath = url.href.split("?").pop() || "home";

    console.log("routePath:", routePath);

    // Construct file paths based on routePath and isMobile
    const filePath = `public/template/${routePath}${isMobile ? "sm" : "lg"}.json`;


    console.log("Fetching file from GitHub:", filePath);

    // Fetch JSON file content from GitHub
    const jsonData = await fetchGitHubFile(filePath);
    const parsedData = JSON.parse(jsonData);

    const sections: Record<string, Array<object>> = {
      Banner: [],
      SlideShow: [],
      RichText: [],
      ImageText: [],
      Video: [],
      ContactForm: [],
      NewsLetter: [],
      CollapseFaq: [],
      MultiColumn: [],
      MultiRow: [],
      Header: [],
      Collection: [],
      ProductList: [],
      DetailPage: [],
      BlogList: [],
      BlogDetail: [],
    };

    if (routePath === "home") {
      parsedData.sections.children.sections.forEach(
        (section: { type: string }) => {
          if (section.type in sections) {
            sections[section.type].push(section);
          }
        }
      );
    } else {
      parsedData.children.sections.forEach((section: { type: string }) => {
        if (section.type in sections) {
          sections[section.type].push(section);
        }
      });
    }

    let Children;
    if (routePath === "home") {
      Children = parsedData.sections.children;
    } else {
      Children = parsedData.children;
    }

    return NextResponse.json({
      Children,
      isMobile,
      currentRoute: routePath,
      template: isMobile ? `${routePath}sm.json` : `${routePath}lg.json`,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",

      },
      { status: 500 }
    );
  }
}
