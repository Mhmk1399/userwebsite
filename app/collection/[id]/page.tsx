"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  BannerSection,
  CollapseSection,
  CollectionSection,
  ContactFormDataSection,
  GallerySection,
  ImageTextSection,
  MultiColumnSection,
  MultiRowSection,
  NewsLetterSection,
  OfferRowSection,
  ProductCardData,
  ProductListSection,
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

export default function CollectionPage() {
  const params = useParams();
  const collectionId = params.id as string;

  const [data, setData] = useState<AllSections[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [orders, setOrders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [collectionData, setCollectionData] = useState<{
    name: string;
    products: ProductCardData[];
  } | null>(null);

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
  };

  const fetchLayoutData = async (activeMode: string) => {
    try {
      const response = await fetch("/api/layout-jason", {
        method: "GET",
        headers: {
          selectedRoute: "store",
          activeMode: activeMode,
          storeId: "storemfcdfog4456qhn",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch layout data: ${response.status}`);
      }

      const layoutData = await response.json();

      return layoutData;
    } catch (error) {
      console.log("Error fetching layout data:", error);
      throw error;
    }
  };

  const fetchCollectionData = async () => {
    try {
      const response = await fetch("/api/collection", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          CollectionId: collectionId,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch collection data: ${response.status}`);
      }

      const data = await response.json();
      setCollectionData(data);
    } catch (error) {
      console.log("Error fetching collection data:", error);
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

        const layoutData = await fetchLayoutData(activeMode);
        await fetchCollectionData();

        if (layoutData && layoutData.sections && layoutData.sections.children) {
          const testData = layoutData.sections.children
            .sections as AllSections[];
          setData(testData);
          setOrders(layoutData.sections.children.order);

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
        }

        document.title = collectionData?.name || "مجموعه محصولات";
      } catch (error) {
        console.log("Error loading page data:", error);
        setError("خطا در بارگذاری صفحه");
      } finally {
        setIsLoading(false);
      }
    };

    if (collectionId) {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [collectionId]);

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

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            خطا در بارگذاری صفحه
          </h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            دوباره تلاش کنید
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <main>
        <div className="grid grid-cols-1 pt-4 px-1">
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
                  collectionProducts={collectionData?.products}
                  hideFilters={true}
                />
              </div>
            ) : null;
          })}
        </div>
      </main>
    </>
  );
}
