import { promises as fs } from "fs";
import path from "path";

import {
  BlogSection,
  CollectionSection,
  ContactFormDataSection,
  FooterSection,
  MultiRowSection,
  ProductSection,
  SlideSection,
  VideoSection,
  BannerSection,
  HeaderSection,
  ImageTextSection,
  MultiColumnSection,
  NewsLetterSection,
  RichTextSection,
  CollapseSection,
} from "@/lib/types";
import { headers } from "next/headers";
import Banner from "@/components/banner";
import SlideShow from "@/components/slideShow";
import RichText from "@/components/richText";
import ImageText from "@/components/imageText";
import Video from "@/components/video";
import ContactForm from "@/components/contactForm";
import NewsLetter from "@/components/newsLetter";
import CollapseFaq from "@/components/collapseFaq";
import MultiColumn from "@/components/multiColumn";
import MultiRow from "@/components/multiRow";
import { Collection } from "@/components/collection";
import Footer from "@/components/footer";

export default async function Page() {
  const getJsonData = async () => {
    try {
      const headersList = headers();
      const userAgent = (await headersList).get("user-agent") || "";
      console.log("User Agent:", userAgent);

      // Simple mobile detection
      const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
      console.log("Is Mobile:", isMobile);

      // Choose path based on device type
      const jsonPath = path.join(
        process.cwd(),
        "public",
        "template",
        isMobile ? "nullSm.json" : "null.json"
      );

      const jsonData = await fs.readFile(jsonPath, "utf-8");
      return { jsonData: JSON.parse(jsonData), isMobile };
    } catch (error) {
      console.error("Error reading JSON file:", error);
      throw error;
    }
  };

  const extractSections = (data: any) => {
    const sections = {
      banners: [] as BannerSection[],
      slideshows: [] as SlideSection[],
      RichText: [] as RichTextSection[],
      ImageText: [] as ImageTextSection[],
      Video: [] as VideoSection[],
      ContactForm: [] as ContactFormDataSection[],
      NewsLetter: [] as NewsLetterSection[],
      CollapseFaq: [] as CollapseSection[],
      MultiColumn: [] as MultiColumnSection[],
      MultiRow: [] as MultiRowSection[],
      Footer: [] as FooterSection[],
      Header: [] as HeaderSection[],
      Collection: [] as CollectionSection[],
      Product: [] as ProductSection[],
      Blog: [] as BlogSection[],

      // Add other section arrays as needed
    };

    // @ts-ignore
    data.sections.children.sections.forEach((section: any) => {
      if (section.type === "Banner") {
        sections.banners.push(section);
      }
      if (section.type === "SlideShow") {
        sections.slideshows.push(section);
      }
      if (section.type === "RichText") {
        sections.RichText.push(section);
      }
      if (section.type === "ImageText") {
        sections.ImageText.push(section);
      }
      if (section.type === "CollapseFaq") {
        sections.CollapseFaq.push(section);
      }
      if (section.type === "Video") {
        sections.Video.push(section);
      }
      if (section.type === "ContactForm") {
        sections.ContactForm.push(section);
      }
      if (section.type === "NewsLetter") {
        sections.NewsLetter.push(section);
      }
      if (section.type === "MultiColumn") {
        sections.MultiColumn.push(section);
      }
      if (section.type === "MultiRow") {
        sections.MultiRow.push(section);
      }
      if (section.type === "Footer") {
        sections.Footer.push(section);
      }
      if (section.type === "Header") {
        sections.Header.push(section);
      }
      if (section.type === "Collection") {
        sections.Collection.push(section);
      }
      if (section.type === "Product") {
        sections.Product.push(section);
      }
      if (section.type === "Blog") {
        sections.Blog.push(section);
      }

      // Add other section type checks
    });

    return sections;
  };

  try {
    const { jsonData, isMobile } = await getJsonData();
    const sections = extractSections(jsonData);

    return (
      <>
        {/* <RichText sections={sections} isMobile={isMobile} />
        <Banner sections={sections} isMobile={isMobile} />
        <SlideShow sections={sections} isMobile={isMobile} />
        <ImageText sections={sections} isMobile={isMobile} /> */}
        {/* <Video sections={sections} isMobile={isMobile} /> */}
        {/* <ContactForm sections={sections} isMobile={isMobile} /> */}
        {/* <NewsLetter sections={sections} isMobile={isMobile} /> */}
        {/* <CollapseFaq sections={sections} isMobile={isMobile} /> */}
        {/* <MultiColumn sections={sections} isMobile={isMobile} /> */}
        {/* <MultiRow sections={sections} isMobile={isMobile} /> */}
        {/* <Collection sections={sections} isMobile={isMobile} /> */}
        {/* <Footer sections={sections} isMobile={isMobile} /> */}
      </>
    );
  } catch (error) {
    console.error("Error:", error);
    return <div>Error loading content</div>;
  }
}
