"use client";
import { useEffect, useState } from "react";
import Data from "../public/template/homelg.json";

import {
  BannerSection,
  BlogBlock,
  BlogDetailBlock,
  CollapseBlock,
  CollapseSection,
  CollectionSection,
  ContactFormDataSection,
  DetailPageBlock,
  GalleryBlock,
  GallerySection,
  HeaderBlock,
  ImageTextBlock,
  ImageTextSection,
  MultiColumnBlock,
  MultiColumnSection,
  MultiRowSection,
  NewsLetterBlock,
  NewsLetterSection,
  OfferRowSection,
  ProductListSection,
  RichTextBlock,
  RichTextSection,
  Section,
  SlideBannerSection,
  SlideSection,
  SpecialOfferSection,
  StorySection,
  VideoSection,
} from "@/lib/types";
import ImageText from "@/components/imageText";
import ContactForm from "@/components/contactForm";
import NewsLetter from "@/components/newsLetter";
import Banner from "@/components/banner";
import CollapseFaq from "@/components/collapseFaq";
import MultiColumn from "@/components/multiColumn";
import MultiRow from "@/components/multiRow";
import SlideShow from "@/components/slideShow";
import Video from "@/components/video";
import { Collection } from "@/components/collection";
import RichText from "@/components/richText";
import ProductList from "@/components/productList";
import { SpecialOffer } from "@/components/specialOffer";
import { Story } from "@/components/story";
import { OfferRow } from "@/components/offerRow";
import Gallery from "@/components/gallery";
import SlideBanner from "@/components/slideBanner";
import { ProductsRow } from "@/components/productsRow";
import homeLgTemplate from "@/public/template/homelg.json";
import homeSmTemplate from "@/public/template/homesm.json";
import { BlogSchema } from "@/components/schema/blogSchema";
import CanvasEditor from "@/components/canvasEditor";

type AllSections = Section &
  RichTextSection &
  BannerSection &
  ImageTextSection &
  VideoSection &
  ContactFormDataSection &
  NewsLetterSection &
  CollapseSection &
  MultiColumnSection &
  SlideSection &
  MultiRowSection &
  ProductListSection &
  CollectionSection &
  SpecialOfferSection &
  StorySection &
  OfferRowSection &
  GallerySection &
  SlideBannerSection &
  ProductListSection 
interface TemplateData {
  sections: {
    children: {
      metaData: {
        title: string;
        description: string;
      };
      sections: Section[];
      type?: string;
      order: string[];
    };
  };
}
interface BlogSchemaProps {
  title: string;
  url: string;
  description: string;
  images: string[];
  sections: {
    heading: string;
    content: string;
    images?: string[];
    lists?: string[];
  }[];
}

interface ExtractedSection {
  heading: string;
  content: string;
}
type BlockType =
  | RichTextBlock
  | ImageTextBlock
  | NewsLetterBlock
  | CollapseBlock
  | MultiColumnBlock
  | DetailPageBlock
  | BlogBlock
  | BlogDetailBlock
  | GalleryBlock
  | HeaderBlock
  | Record<string, unknown>
  | Array<BlockType>;

type GenericBlockType = {
  [key: string]: unknown;
} & Partial<BlockType>;
const extractBlogData = (template: TemplateData): BlogSchemaProps => {
  const sections = template.sections.children.sections;
  console.log(template);

  const metaData = template.sections.children.metaData;

  // Define text property mappings for each section type
  const textMappings = {
    SlideBanner: {
      headingProps: ["heading", "text"],
      contentProps: ["description", "link"],
    },
    SpecialOffer: {
      headingProps: ["textHeading", "heading"],
      contentProps: ["description"],
    },
    Story: {
      headingProps: ["title", "heading"],
      contentProps: ["link", "description"],
    },
    OfferRow: {
      headingProps: ["setting.titleText", "heading"],
      contentProps: ["setting.buttonText", "description"],
    },
    ProductsRow: {
      headingProps: ["textHeading", "heading", "title"],
      contentProps: ["description", "setting.selectedCollection"],
    },
    "ProductsRow-2": {
      headingProps: ["textHeading", "heading", "title"],
      contentProps: ["description", "setting.selectedCollection"],
    },
    Brands: {
      headingProps: ["heading", "title"],
      contentProps: ["description", "brands.name"],
    },
    "Gallery-2": {
      headingProps: ["title", "heading"],
      contentProps: ["description", "setting.titleText"],
    },
    MultiColumn: {
      headingProps: ["title1", "title2", "title3", "heading"],
      contentProps: ["description1", "description2", "description3"],
    },
    NewsLetter: {
      headingProps: ["heading", "title"],
      contentProps: ["description", "btnText"],
    },
    CollapseFaq: {
      headingProps: ["heading", "text1", "text2", "text3", "text4"],
      contentProps: ["content1", "content2", "content3", "content4"],
    },
    RichText: {
      headingProps: ["textHeading", "heading"],
      contentProps: ["description", "btnText"],
    },
    ImageText: {
      headingProps: ["heading", "title"],
      contentProps: ["description", "btnText"],
    },
    Video: {
      headingProps: ["heading", "title"],
      contentProps: ["description", "videoUrl"],
    },
  };

  const extractedSections = sections
    .flatMap((section: Section) => {
      const sectionData: ExtractedSection[] = [];
      const sectionType = section.type;
      const mapping = textMappings[sectionType as keyof typeof textMappings];

      if (mapping) {
        // Update the getNestedValue function to handle the block types properly

        const getNestedValue = (
          obj: unknown,
          path: string
        ): string | undefined => {
          return path.split(".").reduce<unknown>((acc, part) => {
            if (acc && typeof acc === "object") {
              return (acc as GenericBlockType)[part];
            }
            return undefined;
          }, obj) as string | undefined;
        };
        if ("blocks" in section) {
          // Handle array-based blocks
          if (Array.isArray(section.blocks)) {
            section.blocks.forEach((block) => {
              const heading = mapping.headingProps
                .map((prop) => getNestedValue(block, prop))
                .find(Boolean);
              const content = mapping.contentProps
                .map((prop) => getNestedValue(block, prop))
                .find(Boolean);

              if (heading && content) {
                sectionData.push({ heading, content });
              }
            });
          }
          // Handle single block object
          else {
            const heading = mapping.headingProps
              .map((prop) => getNestedValue(section.blocks, prop))
              .find(Boolean);
            const content = mapping.contentProps
              .map((prop) => getNestedValue(section.blocks, prop))
              .find(Boolean);

            if (heading && content) {
              sectionData.push({ heading, content });
            }
          }
        }
      }

      return sectionData;
    })
    .filter((section) => section.heading && section.content);

  return {
    title: metaData?.title,
    description: metaData?.description,
    url: "/",
    images: [
      "/assets/images/bannerdigi.webp",
      "/assets/images/bannerdigi1.webp",
      "/assets/images/bannerdigi2.webp",
    ],
    sections: extractedSections,
  };
};
export default function Page() {
  const [data, setData] = useState<AllSections[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [orders, setOrders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blogData, setBlogData] = useState<BlogSchemaProps | null>(null);
  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch(`/api/generateToken`);
      const sectionToken = await response.text();
      localStorage.setItem("sectionToken", sectionToken);
    };
    fetchToken();
  }, []);
  useEffect(() => {
    document.title = Data?.sections?.children?.metaData?.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        Data?.sections?.children?.metaData?.description
      );
    }
  }, []);

  const componentMap = {
    RichText,
    Banner,
    ImageText,
    Video,
    ContactForm,
    NewsLetter,
    CollapseFaq,
    MultiColumn,
    SlideShow,
    MultiRow,
    ProductList,
    Collection,
    SpecialOffer,
    Story,
    OfferRow,
    Gallery,
    SlideBanner,
    ProductsRow,
    CanvasEditor,
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 430;
      setIsMobile(isMobileView);

      const template = isMobileView ? homeSmTemplate : homeLgTemplate;
      console.log(template);
      const testData = template.sections.children.sections as AllSections[];
      setData(testData);
      setOrders(template.sections.children.order);
      setIsLoading(false);
      const extractedBlogData = extractBlogData(
        template as unknown as TemplateData
      );
      console.log("extractedBlogData", extractedBlogData);

      setBlogData(extractedBlogData);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
    );
  }
  return (
    <>
      {blogData && <BlogSchema blogData={blogData} />}

      <div className="grid grid-cols-1 pt-4 ">
        {orders.map((componentName, index) => {
          const baseComponentName = componentName.split("-")[0];
          const Component =
            componentMap[baseComponentName as keyof typeof componentMap];

          return Component ? (
            <div
              key={componentName}
              style={{ order: index }}
              className="w-full"
            >
              <Component
                sections={data}
                isMobile={isMobile}
                componentName={componentName}
              />
            </div>
          ) : null;
        })}
      </div>
    </>
  );
}
