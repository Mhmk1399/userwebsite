"use client";
import styled from "styled-components";
import { ProductCardData } from "@/lib/types";
import type { SpecialOfferSection } from "@/lib/types";
import ProductCard from "./productCard";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
interface SpecialOfferProps {
  sections: SpecialOfferSection[];
  isMobile: boolean;
  componentName: string;
}

const ScrollContainer = styled.div<{
  $data: SpecialOfferSection;
}>`
  position: relative;
  width: 100%;
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "20"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "20"}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColor || "#ef394e"};
`;

const SpecialOfferSection = styled.section<{
  $data: SpecialOfferSection;
  $isMobile: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
  max-width: 100%;
  overflow-x: scroll;
  scroll-behavior: smooth;
  gap: 10px;
  padding: ${(props) => (props.$isMobile ? "10px" : "20px")};
  background-color: ${(props) =>
    props.$data.blocks?.setting?.backgroundColor || "#ef394e"};
  border-radius: ${(props) =>
    props.$data.blocks?.setting?.cardBorderRadius || "8"}px;
  direction: rtl;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Heading = styled.h2<{
  $data: SpecialOfferSection;
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data.blocks?.setting?.headingColor || "#FFFFFF"};
  font-size: ${(props) =>
    props.$isMobile
      ? "24px"
      : `${props.$data.blocks?.setting?.headingFontSize || "32"}px`};
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.headingFontWeight || "bold"};
  text-align: center;
`;

const ScrollButton = styled.button<{
  $data: SpecialOfferSection;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: "#FFFFFF";
  opacity: 0.5;
  color: ${(props) => props.$data.blocks?.setting?.btnTextColor || "#000000"};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &.left {
    left: 10px;
  }

  &.right {
    right: 10px;
  }
  &:hover {
    opacity: 0.8;
  }
`;

export const SpecialOffer: React.FC<SpecialOfferProps> = ({
  sections,
  isMobile,
  componentName,
}) => {
  const [specialOfferProducts, setSpecialOfferProducts] = useState<
    ProductCardData[]
  >([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const sectionData = sections.find(
    (section) => section.type === componentName
  );
  const CollectionId = sectionData?.blocks.setting.selectedCollection;

  const router = useRouter();

  useEffect(() => {
    const fetchSpecialOffers = async () => {
      try {
        const response = await fetch("/api/collection", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            CollectionId: CollectionId || "", // Remove extra quotes
          },
        });

        const data = await response.json();

        if (data && data.products) {
          setSpecialOfferProducts(data.products);
        } else {
          console.log("No products found in collection");
        }
      } catch (error) {
        console.log("Error fetching special offers:", error);
      }
    };
    fetchSpecialOffers();
  }, []);

  if (!sectionData) {
    return <div>No special offers available</div>;
  }

  const handleScroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition =
        containerRef.current.scrollLeft +
        (direction === "left" ? scrollAmount : -scrollAmount);
      containerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <ScrollContainer $data={sectionData} className=" rounded-lg">
      <SpecialOfferSection
        ref={containerRef}
        $data={sectionData}
        $isMobile={isMobile}
      >
        <div className="flex flex-col items-center justify-center  lg:px-10">
          <Heading
            $data={sectionData}
            $isMobile={isMobile}
            className="animate-pulse"
          >
            {sectionData.blocks?.textHeading}
          </Heading>
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            height="80px"
            viewBox="0 -960 960 960"
            width="80px"
            fill="#FFFFFF"
          >
            <path d="M300-520q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T360-660q0-25-17.5-42.5T300-720q-25 0-42.5 17.5T240-660q0 25 17.5 42.5T300-600Zm360 440q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T720-300q0-25-17.5-42.5T660-360q-25 0-42.5 17.5T600-300q0 25 17.5 42.5T660-240Zm-444 80-56-56 584-584 56 56-584 584Z" />
          </svg> */}
        </div>

        {specialOfferProducts.map((product) => (
          <ProductCard key={product._id} productData={product} />
        ))}
        <button
          onClick={() => router.push(`/collection/${CollectionId}`)}
          className=" px-4 py-2 ml-10 rounded-lg flex flex-col gap-y-2 justify-center items-center group min-h-[400px]  min-w-[220px] text-white text-nowrap transition-all duration-500 hover:bg-gray-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="60px"
            viewBox="0 -960 960 960"
            width="60px"
            fill="#ffffff"
            className="group-hover:fill-gray-400"
          >
            <path d="m480-334 42-42-74-74h182v-60H448l74-74-42-42-146 146 146 146Zm0 254q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" />
          </svg>
          <span className="text-2xl group-hover:text-black/70">
            {" "}
            مشاهده همه‌
          </span>
        </button>
      </SpecialOfferSection>

      <ScrollButton
        className="left bg-white"
        onClick={() => handleScroll("left")}
        $data={sectionData}
        aria-label="left"
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
        </svg>
      </ScrollButton>

      <ScrollButton
        aria-label="right"
        className="right bg-white"
        onClick={() => handleScroll("right")}
        $data={sectionData}
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </ScrollButton>
    </ScrollContainer>
  );
};
