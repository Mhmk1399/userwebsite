import { promises as fs } from "fs";
import path from "path";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);

    const jsonPath = path.join(
      process.cwd(),
      "public",
      "template",
      isMobile ? "productSm.json" : "product.json"
    );

    const jsonData = await fs.readFile(jsonPath, "utf-8");
    const parsedData = JSON.parse(jsonData);

    const sections: Record<string, any[]> = {
      ProductList: [],
    };

    parsedData.children.sections.forEach(
      (section: { type: string }) => {
        if (section.type in sections) {
          sections[section.type].push(section);
        }
      }
    );

    console.log("Parsed sections:", sections);
    console.log("Banner sections:", sections.ProductList);

    return NextResponse.json({ sections, isMobile });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
