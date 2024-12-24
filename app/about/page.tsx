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

export default function Page() {
  const [data, setData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
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
  };

  useEffect(() => {
    const getData = async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not set");
      }
      const routePath = pathname.split("/").pop() || "home";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sections?${routePath}`,
        {
          cache: "no-store",
        }
      );
      const data = await response.json();
      console.log("data:", data.Children.sections);
      
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

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* <Banner sections={data.sections} isMobile={isMobile} />
      <SlideShow sections={data.sections} isMobile={isMobile} />
      <ImageText sections={data.sections} isMobile={isMobile} />
      <Video sections={data.sections} isMobile={isMobile} />
      <ContactForm sections={data.sections} isMobile={isMobile} />
      <NewsLetter sections={data.sections} isMobile={isMobile} />
      <CollapseFaq sections={data.sections} isMobile={isMobile} />
      <MultiColumn sections={data.sections} isMobile={isMobile} />
      <MultiRow sections={data.sections} isMobile={isMobile} />
      <Collection sections={data.sections} isMobile={isMobile} /> */}

    { data && <div className="grid grid-cols-1 mt-32">
        {orders.map((componentName, index) => {
          const baseComponentName = componentName;
          const Component =
            componentMap[baseComponentName as keyof typeof componentMap];

          console.log(componentName);

          return Component ? (
            <div
              key={componentName} // Using the full componentName which includes the UUID
              style={{ order: index }}
              className="w-full"
            >
              <Component sections={data} isMobile={isMobile} />
            </div>
          ) : null;
        })}
      </div>}
    </>
  );
}
