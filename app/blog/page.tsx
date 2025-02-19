"use client";
import { useEffect, useState } from "react";
import Data from "../../public/template/bloglg.json";

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
import BlogList from "@/components/blogList";
import blogLgTemplate from "@/public/template/bloglg.json";
import blogSmTemplate from "@/public/template/blogsm.json";
import { BlogSchema } from "@/components/schema/blogSchema";

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
    children: {
      metaData: {
        title: string;
        description: string;
      };
      sections: Section[];
      type?: string;
      order: string[];
    };
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
  | Record<string, unknown>
  | Array<BlockType>;
  type GenericBlockType = {
    [key: string]: unknown;
  } & Partial<BlockType>;
  const extractBlogData = (template: TemplateData): BlogSchemaProps => {
    const sections = template.children.sections;
      
      const metaData = template.children.metaData;

    // Define text property mappings for each section type
    const textMappings = {
      SlideBanner: {
        headingProps: ['heading', 'text'],
        contentProps: ['description', 'link']
      },
      SpecialOffer: {
        headingProps: ['textHeading', 'heading'],
        contentProps: ['description', 'setting.selectedCollection']
      },
      Story: {
        headingProps: ['title', 'heading'],
        contentProps: ['link', 'description']
      },
      OfferRow: {
        headingProps: ['setting.titleText', 'heading'],
        contentProps: ['setting.buttonText', 'description']
      },
      ProductsRow: {
        headingProps: ['textHeading', 'heading', 'title'],
        contentProps: ['description', 'setting.selectedCollection']
      },
      'ProductsRow-2': {
        headingProps: ['textHeading', 'heading', 'title'],
        contentProps: ['description', 'setting.selectedCollection']
      },
      Brands: {
        headingProps: ['heading', 'title'],
        contentProps: ['description', 'brands.name']
      },
      'Gallery-2': {
        headingProps: ['title', 'heading'],
        contentProps: ['description', 'setting.titleText']
      },
      MultiColumn: {
        headingProps: ['title1', 'title2', 'title3', 'heading'],
        contentProps: ['description1', 'description2', 'description3']
      },
      NewsLetter: {
        headingProps: ['heading', 'title'],
        contentProps: ['description', 'btnText']
      },
      CollapseFaq: {
        headingProps: ['heading', 'text1', 'text2', 'text3', 'text4'],
        contentProps: ['content1', 'content2', 'content3', 'content4']
      },
      RichText: {
        headingProps: ['textHeading', 'heading'],
        contentProps: ['description', 'btnText']
      },
      ImageText: {
        headingProps: ['heading', 'title'],
        contentProps: ['description', 'btnText']
      },
      Video: {
        headingProps: ['heading', 'title'],
        contentProps: ['description', 'videoUrl']
      }
    };
  
    const extractedSections = sections.flatMap((section: Section) => {
      const sectionData: ExtractedSection[] = [];
      const sectionType = section.type;
      const mapping = textMappings[sectionType as keyof typeof textMappings];
  
      if (mapping) {
     // Update the getNestedValue function to handle the block types properly
     const getNestedValue = (obj: unknown, path: string): string | undefined => {
      return path.split('.').reduce<unknown>((acc, part) => {
        if (acc && typeof acc === 'object') {
          return (acc as GenericBlockType)[part];
        }
        return undefined;
      }, obj) as string | undefined;
    };

        
  
        if ('blocks' in section) {
          // Handle array-based blocks
          if (Array.isArray(section.blocks)) {
            section.blocks.forEach(block => {
              const heading = mapping.headingProps.map(prop => getNestedValue(block, prop)).find(Boolean);
              const content = mapping.contentProps.map(prop => getNestedValue(block, prop)).find(Boolean);
              
              if (heading && content) {
                sectionData.push({ heading, content });
              }
            });
          } 
          // Handle single block object
          else {
            const heading = mapping.headingProps.map(prop => getNestedValue(section?.blocks, prop)).find(Boolean);
            const content = mapping.contentProps.map(prop => getNestedValue(section?.blocks, prop)).find(Boolean);
            
            if (heading && content) {
              sectionData.push({ heading, content });
            }
          }
        }
      }
  
      return sectionData;
    }).filter(section => section.heading && section.content);
  
    return {
      title:metaData.title ,
      description: metaData.description,
      url: "/",
      images: ["/assets/images/bannerdigi.webp", "/assets/images/bannerdigi1.webp", "/assets/images/bannerdigi2.webp"],
      sections: extractedSections
    };
  };
  

export default function Page() {
  const [data, setData] = useState<AllSections[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [orders, setOrders] = useState<string[]>([]);
  const[blogData,setBlogData]=useState<BlogSchemaProps>({
    title: "",
    description: "",
    url: "",
    images: [],
    sections: [],
  });
  useEffect(() => {
    document.title = Data.children.metaData.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        Data.children.metaData.description
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
    BlogList,
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 430;
      setIsMobile(isMobileView);

      const template = isMobileView ? blogSmTemplate : blogLgTemplate;
      const testData = template.children.sections as AllSections[];
      setData(testData);
      setOrders(template.children.order);
      const extractedBlogData = extractBlogData(template as unknown as TemplateData);
      console.log(extractedBlogData);
      
      setBlogData(extractedBlogData);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
          {blogData && <BlogSchema blogData={blogData} />}
    <div className="grid grid-cols-1 pt-4 px-1">
      {orders.map((componentName, index) => {
        const baseComponentName = componentName.split("-")[0];
        const Component =
          componentMap[baseComponentName as keyof typeof componentMap];

        return Component ? (
          <div key={componentName} style={{ order: index }} className="w-full">
            <Component
              sections={data}
              isMobile={isMobile}
              componentName={componentName}
            />
          </div>
        ) : null;
      })}
    </div></>
  );
}
