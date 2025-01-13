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
import DetailPage from "./[_id]/page";

export default function Page() {
  const [data, setData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    DetailPage,
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
      setLoading(false);
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
      {data && (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((componentName, index) => {
            const baseComponentName = componentName;
            const Component =
              componentMap[baseComponentName as keyof typeof componentMap];
            return Component ? (
              <div
                key={componentName} // Using the full componentName which includes the UUID
                style={{ order: index }}
                className="w-full"
              >
                <Component sections={data} isMobile={isMobile} componentName={componentName} />
              </div>
            ) : null;
          })}
        </div>
      )}
    </>
  );
}
