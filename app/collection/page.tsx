"use client";
import { useEffect, useState } from "react";
import Data from "../../public/template/collectionlg.json";

import {
  BannerSection,
  CollapseSection,
  CollectionSection,
  ContactFormDataSection,
  DetailPageSection,
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
import { OfferRow } from "@/components/offerRow";
import { SpecialOffer } from "@/components/specialOffer";
import { Story } from "@/components/story";
import DetailPage from "../store/[_id]/page";
import collectionLgTemplate from "@/public/template/collectionlg.json";
import collectionSmTemplate from "@/public/template/collectionsm.json";

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
  ProductListSection &
  DetailPageSection;

export default function Page() {
  const [data, setData] = useState<AllSections[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [orders, setOrders] = useState<string[]>([]);

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
    Collection,
    ProductList,
    DetailPage,
    OfferRow,
    SpecialOffer,
    Story,
  };
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 430;
      setIsMobile(isMobileView);

      const template = isMobileView
        ? collectionSmTemplate
        : collectionLgTemplate;
      console.log(template);
      const testData = template.children.sections as AllSections[];
      setData(testData);
      setOrders(template.children.order);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
