"use client";
import styled from "styled-components";
import ProductCard from "./productCard";
import { useRef, useState, useEffect } from "react";
import { ProductCardData, ProductRowSection, Section } from "@/lib/types";
import { useRouter } from "next/navigation";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface ProductsRowProps {
  sections: Section[]; // Using Section interface from types.ts
  isMobile: boolean;
  componentName: string;
}

const ScrollContainer = styled.div<{
  $data: ProductRowSection;
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
    props.$data.setting?.backgroundColor || "#ffffff"};
  min-height: ${(props) => props.$data.blocks.setting.height}px;
  box-shadow: ${(props) =>
    `${props.$data.blocks.setting?.shadowOffsetX || 0}px 
     ${props.$data.blocks.setting?.shadowOffsetY || 4}px 
     ${props.$data.blocks.setting?.shadowBlur || 10}px 
     ${props.$data.blocks.setting?.shadowSpread || 0}px 
     ${props.$data.blocks.setting?.shadowColor || "#fff"}`};
`;

const ProductsRowSection = styled.section<{
  $data: ProductRowSection;
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
  max-height: 450px;
  gap: 10px;
  padding: ${(props) => (props.$isMobile ? "10px" : "20px")};
  background-color: ${(props) =>
    props.$data.blocks?.setting?.backgroundColor || "#ffffff"};
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
  $data: ProductRowSection;
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data.blocks?.setting?.headingColor || "#000000"};
  font-size: ${(props) =>
    `${props.$data.blocks?.setting?.headingFontSize || "32"}px`};
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.headingFontWeight || "bold"};
  text-align: center;
`;

const ScrollButton = styled.button<{
  $data: ProductRowSection;
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
          animation: productRowNavPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes productRowNavPulse {
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
          animation: productRowNavGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes productRowNavGlow {
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
          animation: productRowNavBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes productRowNavBrightness {
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
          animation: productRowNavBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes productRowNavBlur {
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
          animation: productRowNavSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes productRowNavSaturate {
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
          animation: productRowNavContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes productRowNavContrast {
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
          animation: productRowNavOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes productRowNavOpacity {
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
          animation: productRowNavShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes productRowNavShadow {
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
const isSpecialOfferBlock = (blocks: unknown): blocks is ProductRowSection => {
  return (
    blocks !== null && typeof blocks === "object" && "textHeading" in blocks
  );
};

export const ProductsRow: React.FC<ProductsRowProps> = ({
  sections,
  isMobile,
  componentName,
}) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<ProductCardData[]>([]);
  // const [Loading, setLoading] = useState(true);
  const sectionData = sections.find(
    (section: Section) => section.type === componentName
  ) as ProductRowSection;

  const CollectionId = sectionData?.blocks.setting.selectedCollection;

  useEffect(() => {
    const fetchSpecialOffers = async () => {
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
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.log("Error fetching special offers:", error);
      }
    };
    if (CollectionId) {
      fetchSpecialOffers();
    }
  }, [CollectionId]);

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

  if (!sectionData) return null;

  // if (Loading) {
  //   return null;
  // }
  return (
    <ScrollContainer $data={sectionData} className="rounded-lg">
      <ProductsRowSection
        ref={containerRef}
        $data={sectionData}
        $isMobile={isMobile}
      >
        <div className="flex flex-col items-center justify-center lg:px-10">
          <Heading
            $data={sectionData}
            $isMobile={isMobile}
            className="animate-pulse"
            dir="rtl"
          >
            {isSpecialOfferBlock(sectionData.blocks)
              ? sectionData.blocks.textHeading
              : ""}
          </Heading>
        </div>
          {products.map((product, idx) => (
            <ProductCard key={idx} productData={product} />
          ))}
        <button
          onClick={() => router.push(`/collection/${CollectionId}`)}
          className="px-4 py-2 ml-10 rounded-lg flex flex-col gap-y-2 justify-center items-center group min-h-[200px] min-w-[220px] text-black text-nowrap transition-all duration-500 hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="60px"
              viewBox="0 -960 960 960"
              width="60px"
              fill="#3ac1ee"
              className="group-hover:fill-gray-400"
            >
              <path d="m480-334 42-42-74-74h182v-60H448l74-74-42-42-146 146 146 146Zm0 254q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" />
            </svg>
            <span className="text-2xl"> مشاهده همه‌</span>
          </button>
      </ProductsRowSection>

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
