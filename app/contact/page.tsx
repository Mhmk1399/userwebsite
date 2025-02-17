"use client";
import { useEffect, useState } from "react";

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
import { SpecialOffer } from "@/components/specialOffer";
import { Story } from "@/components/story";
import { OfferRow } from "@/components/offerRow";
import Gallery from "@/components/gallery";
import SlideBanner from "@/components/slideBanner";
import { ProductsRow } from "@/components/productsRow";
import contactLgTemplate from "@/public/template/contactlg.json";
import contactSmTemplate from "@/public/template/contactsm.json";

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

export default function Page() {
  const [data, setData] = useState<AllSections[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [orders, setOrders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 430;
      setIsMobile(isMobileView);

      const template = isMobileView ? contactSmTemplate : contactLgTemplate;
      console.log(template);
      const testData = template.children.sections as AllSections[];
      setData(testData);
      setOrders(template.children.order);
      setIsLoading(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  if(isLoading) {
    return <div className="flex justify-center items-center h-screen">
<div className="flex flex-row gap-2">
  <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
  <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
  <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
</div>
    </div>;
  }
  return (
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
    </div>
  );
}
