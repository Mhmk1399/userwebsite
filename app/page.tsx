"use client";
import { useEffect, useState } from "react";

import {
  BannerSection,
  BlogBlock,
  BlogDetailBlock,
  CollapseBlock,
  CollapseSection,
  CollectionSection,
  ContactFormDataSection,
  DetailPageBlock,
  FooterSection,
  GalleryBlock,
  GallerySection,
  HeaderBlock,
  HeaderSection,
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
import { BlogSchema } from "@/components/schema/blogSchema";
import CanvasEditor from "@/components/canvasEditor";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Brands } from "@/components/brands";

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
  ProductListSection;

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
  const metaData = template.sections.children.metaData;

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
          } else {
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



export default function HomePage() {
  const [data, setData] = useState<AllSections[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [orders, setOrders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blogData, setBlogData] = useState<BlogSchemaProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [headerData, setHeaderData] = useState<HeaderSection | null>(null);
  const [footerData, setFooterData] = useState<FooterSection | null>(null);

  // Fetch layout data from API
  const fetchLayoutData = async (routeName: string, activeMode: string) => {
    try {
      console.log('Fetching from URL:', window.location.href);
      console.log('Current host:', window.location.host);
      
      const response = await fetch("/api/layout-jason", {
        method: "GET",
        headers: {
          selectedRoute: routeName,
          activeMode: activeMode,
        },
      });
      console.log(response);

      if (!response.ok) {
        console.log(`Failed to fetch layout data: ${response.status}`);
      }

      const layoutData = await response.json();
      
      // Extract header and footer data
      if (layoutData.sections?.sectionHeader) {
        setHeaderData(layoutData.sections.sectionHeader);
      }
      

      if (layoutData.sections?.sectionFooter) {
        setFooterData(layoutData.sections.sectionFooter);
      }
      

      
      return layoutData;
    } catch (error) {
      console.error("Error fetching layout data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const handleResize = async () => {
      const isMobileView = window.innerWidth < 430;
      setIsMobile(isMobileView);

      const activeMode = isMobileView ? "sm" : "lg";

      try {
        setIsLoading(true);
        setError(null);

        // Always use "home" for the home page
        const layoutData = await fetchLayoutData("home", activeMode);
        

        if (layoutData && layoutData.sections && layoutData.sections.children) {
          const testData = layoutData.sections.children
            .sections as AllSections[];
          setData(testData);
          setOrders(layoutData.sections.children.order);

          // Update document title and meta description
          if (layoutData.sections.children.metaData) {
            document.title = layoutData.sections.children.metaData.title;
            const metaDescription = document.querySelector(
              'meta[name="description"]'
            );
            if (metaDescription) {
              metaDescription.setAttribute(
                "content",
                layoutData.sections.children.metaData.description
              );
            }
          }

          // Extract blog data
          const extractedBlogData = extractBlogData(layoutData as TemplateData);
          setBlogData(extractedBlogData);
        }
      } catch (error) {
        console.error("Error loading home page data:", error);
        setError("Failed to load home page content");
      } finally {
        setIsLoading(false);
      }
    };

    handleResize();
    //   window.addEventListener("resize", handleResize);
    //   return () => window.removeEventListener("resize", handleResize);
  }, []);

  const componentMap = {
    RichText,
    Banner,
    Brands,
    ImageText,
    Video,
    ContactForm,
    NewsLetter,
    ProductsRow,
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
    CanvasEditor,
  };

  if (isLoading) {
    return (
      <>
        {/* Header - even during loading */}
        <Header isMobile={isMobile} headerData={headerData ?? undefined} />

        <main>
          <div className="flex justify-center items-center h-screen">
            <div className="flex flex-row gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
              <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        </main>

        {/* Footer - even during loading */}
        <Footer footerData={footerData ?? undefined} />
      </>
    );
  }

  if (error) {
    return (
      <>
        {/* Header - even during error */}
        <Header isMobile={isMobile} headerData={headerData ?? undefined} />

        <main>
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">خطا</h1>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        </main>

        {/* Footer - even during error */}
        <Footer footerData={footerData ?? undefined} />
      </>
    );
  }

  if (!data.length) {
    return (
      <>
        {/* Header - even when no data */}
        <Header isMobile={isMobile} headerData={headerData ?? undefined} />

        <main>
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-600 mb-4">
                هیچ محتوایی یافت نشد
              </h1>
            </div>
          </div>
        </main>

        {/* Footer - even when no data */}
        <Footer footerData={footerData ?? undefined} />
      </>
    );
  }

  return (
    <>
      {/* Header with dynamic data */}
      <Header isMobile={isMobile} headerData={headerData ?? undefined} />

      {/* Main content */}
      <main>
        {blogData && <BlogSchema blogData={blogData} />}

        <div className="grid grid-cols-1 pt-4">
          {orders.map((componentName, index) => {
            const baseComponentName = componentName.split("-")[0];
            const Component =
              componentMap[baseComponentName as keyof typeof componentMap];

            console.log(baseComponentName, "////////////");

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
      </main>

      {/* Footer with dynamic data */}
      <Footer footerData={footerData ?? undefined} />
    </>
  );
}
