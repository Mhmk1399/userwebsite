"use client";
import styled from "styled-components";
import { ProductCardData } from "@/lib/types";
import type { SpecialOfferSection } from "@/lib/types";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import ProductCardCollection from "./productCardCollection";

interface SpecialOfferProps {
  sections: SpecialOfferSection[];
  isMobile: boolean;
  componentName: string;
}

const ScrollContainer = styled.div<{
  $data: SpecialOfferSection;
}>`
  position: relative;
  max-width: 100%;
  margin-top: ${(props) => props.$data.setting.marginTop || "30"}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom}px;
  margin-right: ${(props) => props.$data.setting.marginRight}px;
  margin-left: ${(props) => props.$data.setting.marginLeft}px;
  padding-top: ${(props) => props.$data.setting.paddingTop}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom}px;
  padding-left: ${(props) => props.$data.setting.paddingLeft}px;
  padding-right: ${(props) => props.$data.setting.paddingRight}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColor || "#ef394e"};
  min-height: ${(props) => props.$data.blocks.setting.height}px;
  box-shadow: ${(props) =>
    `${props.$data.blocks.setting?.shadowOffsetX || 0}px 
     ${props.$data.blocks.setting?.shadowOffsetY || 4}px 
     ${props.$data.blocks.setting?.shadowBlur || 10}px 
     ${props.$data.blocks.setting?.shadowSpread || 0}px 
     ${props.$data.blocks.setting?.shadowColor || "#fff"}`};
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
  max-height: 450px;
  max-width: 100%;
  overflow-x: scroll;
  scroll-behavior: smooth;
  gap: 10px;
  padding: ${(props) => (props.$isMobile ? "10px" : "20px")};

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
    `${props.$data.blocks?.setting?.headingFontSize || "32"}px`};
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
  background-color: ${(props) =>
    props.$data.blocks?.setting?.btnBackgroundColor || "#000000"};
  color: ${(props) => props.$data.blocks?.setting?.btnTextColor || "#000000"};
  opacity: 0.8;
  border: none;
  border-radius: ${(props) => props.$data.blocks?.setting?.btnRadius || "5"}px;
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
  /* Apply navigation button animations */
  ${(props) => {
    const navAnimation = props.$data.blocks?.setting?.navAnimation;
    if (!navAnimation) return "";

    const { type, animation: animConfig } = navAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
          ${selector} {
            animation: specialOfferNavPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes specialOfferNavPulse {
            0%, 100% { 
              opacity: 1;
              filter: brightness(1);
            }
            50% { 
              opacity: 0.7;
              filter: brightness(1.3);
            }
          }
        `;
    } else if (animConfig.type === "glow") {
      return `
          ${selector} {
            animation: specialOfferNavGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes specialOfferNavGlow {
            0%, 100% { 
              filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0));
            }
            50% { 
              filter: brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
            }
          }
        `;
    } else if (animConfig.type === "brightness") {
      return `
          ${selector} {
            animation: specialOfferNavBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes specialOfferNavBrightness {
            0%, 100% { 
              filter: brightness(1);
            }
            50% { 
              filter: brightness(1.4);
            }
          }
        `;
    } else if (animConfig.type === "blur") {
      return `
          ${selector} {
            animation: specialOfferNavBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes specialOfferNavBlur {
            0%, 100% { 
              filter: blur(0px);
            }
            50% { 
              filter: blur(2px);
            }
          }
        `;
    } else if (animConfig.type === "saturate") {
      return `
          ${selector} {
            animation: specialOfferNavSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes specialOfferNavSaturate {
            0%, 100% { 
              filter: saturate(1);
            }
            50% { 
              filter: saturate(1.8);
            }
          }
        `;
    } else if (animConfig.type === "contrast") {
      return `
          ${selector} {
            animation: specialOfferNavContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes specialOfferNavContrast {
            0%, 100% { 
              filter: contrast(1);
            }
            50% { 
              filter: contrast(1.5);
            }
          }
        `;
    } else if (animConfig.type === "opacity") {
      return `
          ${selector} {
            animation: specialOfferNavOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes specialOfferNavOpacity {
            0% { 
              opacity: 1;
            }
            50% { 
              opacity: 0.4;
            }
            100% { 
              opacity: 1;
            }
          }
        `;
    } else if (animConfig.type === "shadow") {
      return `
          ${selector} {
            animation: specialOfferNavShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes specialOfferNavShadow {
            0%, 100% { 
              filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
            }
            50% { 
              filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
            }
          }
        `;
    }

    return "";
  }}
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
      if (!CollectionId) {
        console.log("No CollectionId provided");
        return;
      }

      try {
        const response = await fetch("/api/collection", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            CollectionId: CollectionId,
          },
        });

        if (!response.ok) {
          console.log(`API error: ${response.status} ${response.statusText}`);
          return;
        }

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
  }, [CollectionId]);

  if (!sectionData) return null;

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
            dir="rtl"
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
          <ProductCardCollection key={product._id} productData={product} />
        ))}
        <button
          onClick={() => router.push(`/collection/${CollectionId}`)}
          className=" px-4 py-2 ml-10 rounded-lg flex flex-col gap-y-2 justify-center items-center group min-h-[200px]  min-w-[220px] text-white text-nowrap transition-all duration-500 hover:bg-gray-50"
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

      {/* Navigation Buttons with Animation */}
      <ScrollButton
        className="left"
        onClick={() => handleScroll("left")}
        $data={sectionData}
      >
        <BiChevronLeft size={24} />
      </ScrollButton>

      <ScrollButton
        className="right"
        onClick={() => handleScroll("right")}
        $data={sectionData}
      >
        <BiChevronRight size={24} />
      </ScrollButton>
    </ScrollContainer>
  );
};
