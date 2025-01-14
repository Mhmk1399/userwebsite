import { promises as fs } from "fs";
import path from "path";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);

    console.log("User Agent:", userAgent);

    const url = new URL(request.url);
    const routePath = url.href.split("?").pop() || "home";

    console.log("routePath:", routePath);

    const templateDir = path.join(process.cwd(), "public", "template");
    let fileNames: string[];
    
    try {
      fileNames = await fs.readdir(templateDir);
    } catch (error) {
      console.log('Error reading template directory:', error);
      return NextResponse.json(
        { error: 'Failed to read template directory' },
        { status: 500 }
      );
    }
    
    const templateMap: Record<string, { lg: string; sm: string }> = {};
    
    fileNames
      .filter(name => name.endsWith('.json'))
      .forEach(fileName => {
        const baseName = fileName.replace(/lg\.json$|sm\.json$/, '');
        
        if (!templateMap[baseName]) {
          templateMap[baseName] = { lg: '', sm: '' };
        }
        
        if (fileName.includes('lg.json')) {
          templateMap[baseName].lg = fileName;
        } else if (fileName.includes('sm.json')) {
          templateMap[baseName].sm = fileName;
        }
      });
    
    console.log("templateMap:", templateMap);

    const template = templateMap[routePath] || {
      lg: "null.json",
      sm: "nullSm.json",
    };

    console.log("Template:", template);
    const jsonPath = path.join(
      process.cwd(),
      "public",
      "template",
      isMobile ? template.sm : template.lg
    );
    console.log("jsonPath:", jsonPath);

    const jsonData = await fs.readFile(jsonPath, "utf-8");
    const parsedData = JSON.parse(jsonData);

    const sections: Record<string, Array<object> >= {
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
      template: isMobile ? template.sm : template.lg,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
