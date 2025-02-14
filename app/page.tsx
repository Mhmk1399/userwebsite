"use client";
import { useEffect, useState } from "react";
import ImageText from "@/components/imageText";
import ContactForm from "@/components/contactForm";
import NewsLetter from "@/components/newsLetter";
import { usePathname } from "next/navigation";
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

export default function Page() {
  const [data, setData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<string[]>([]);
  const pathname = usePathname();

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
    ProductsRow
  };

  useEffect(() => {
    const getData = async () => {
      console.log(setIsMobile);
      console.log(setError);
     
      const routePath = pathname.split("/").pop() || "home";

      const response = await fetch(
        "/api/sections?" + routePath,
        {
          cache: "no-store",
        }
      );
      const data = await response.json();
      localStorage.setItem('sectionsToken', data.sectionsToken);
      console.log(data.sectionsToken);

      setData(data.Children.sections);
      setOrders(data.Children.order);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
    };
    getData();
  }, [pathname]);

  if (error) {
    return <div>{error}</div>;
  }
  

  if (data===null) {
    return <div className="mt-28">Loading...</div>;
  }


  return (
    <>
      <div className="grid grid-cols-1 pt-4 px-2">
        {orders.map((componentName, index) => {
          const baseComponentName = componentName.split("-")[0];
          const Component =
            componentMap[baseComponentName as keyof typeof componentMap];

          return Component ? (
            <div
              key={componentName} // Using the full componentName which includes the UUID
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
