"use client";
import styled from "styled-components";
import Image from "next/image";
import { useRef } from "react";
import type { BrandsSection } from "@/lib/types";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface BrandsProps {
  sections: BrandsSection[];
  isMobile: boolean;
  componentName: string;
}

const BrandsContainer = styled.div<{
  $data: BrandsSection;
}>`
  margin-top: ${(props) => props.$data.setting.marginTop || "30"}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom}px;
  margin-right: ${(props) => props.$data.setting.marginRight}px;
  margin-left: ${(props) => props.$data.setting.marginLeft}px;
  padding-top: ${(props) => props.$data.setting.paddingTop}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom}px;
  padding-left: ${(props) => props.$data.setting.paddingLeft}px;
  padding-right: ${(props) => props.$data.setting.paddingRight}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColor || "#FFFFFF"};
  border-radius: ${(props) => props.$data.setting?.borderRadius || "20"}px;
  box-shadow: ${(props) =>
    `${props.$data.blocks.setting?.shadowOffsetX || 0}px 
     ${props.$data.blocks.setting?.shadowOffsetY || 4}px 
     ${props.$data.blocks.setting?.shadowBlur || 10}px 
     ${props.$data.blocks.setting?.shadowSpread || 0}px 
     ${props.$data.blocks.setting?.shadowColor || "#fff"}`};
`;

const Heading = styled.h2<{
  $data: BrandsSection;
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data.blocks?.setting?.headingColor || "#14213D"};
  font-size: ${(props) =>
    `${props.$data.blocks?.setting?.headingFontSize || "32"}px`};
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.headingFontWeight || "bold"};
  text-align: center;
  margin-bottom: 1px;
`;
const Description = styled.p<{
  $data: BrandsSection;
  $isMobile: boolean;
}>`
  color: ${(props) =>
    props.$data.blocks?.setting?.descriptionColor || "#14213D"};
  font-size: ${(props) =>
    `${props.$data.blocks?.setting?.descriptionFontSize || "32"}px`};
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.descriptionFontWeight || "bold"};
  text-align: center;
  padding: 0 20px;
`;

const BrandsGrid = styled.div<{
  $data: BrandsSection;
  $isMobile: boolean;
}>`
  display: flex;
  flex-wrap: nowrap;
  justify-content: start;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  margin-top: 20px;
  gap: 10px;
  padding: 10px 0;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ScrollButton = styled.button<{
  $data: BrandsSection;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: ${(props) =>
    props.$data.blocks?.setting?.btnBackgroundColor || "#fff"};
  color: ${(props) => props.$data.blocks?.setting?.btnColor || "#000"};
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
          animation: brandNavPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes brandNavPulse {
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
          animation: brandNavGlow ${animConfig.duration} ${animConfig.timing} ${
        animConfig.delay || "0s"
      } ${animConfig.iterationCount || "1"};
        }
        
        @keyframes brandNavGlow {
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
          animation: brandNavBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes brandNavBrightness {
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
          animation: brandNavBlur ${animConfig.duration} ${animConfig.timing} ${
        animConfig.delay || "0s"
      } ${animConfig.iterationCount || "1"};
        }
        
        @keyframes brandNavBlur {
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
          animation: brandNavSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes brandNavSaturate {
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
          animation: brandNavContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes brandNavContrast {
          0%, 100% { 
            filter: contrast(1)          }
          50% { 
            filter: contrast(1.5);
          }
        }
      `;
    } else if (animConfig.type === "opacity") {
      return `
        ${selector} {
          animation: brandNavOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes brandNavOpacity {
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
          animation: brandNavShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes brandNavShadow {
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

const BrandCard = styled.a<{
  $data: BrandsSection;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: ${(props) =>
    props.$data.blocks?.setting?.cardBackground || "#FFFFFF"};
  transition: all 0.3s ease;
  flex-shrink: 0;
  min-width: 120px;
`;

const BrandName = styled.span<{
  $data: BrandsSection;
}>`
  color: ${(props) => props.$data.blocks?.setting?.brandNameColor || "#666666"};
  font-size: ${(props) =>
    props.$data.blocks?.setting?.brandNameFontSize || "16"}px;
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.brandNameFontWeight || "normal"};
  margin-top: 0.5rem;
`;

export const Brands: React.FC<BrandsProps> = ({
  sections,
  isMobile,
  componentName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

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

  const sectionData = sections.find(
    (section) => section.type === componentName
  );

  if (!sectionData) {
    return null;
  }

  return (
    <BrandsContainer
      $data={sectionData}
      className={`transition-all duration-150 ease-in-out relative `}
    >
      <Heading dir="rtl" $data={sectionData} $isMobile={isMobile}>
        {sectionData.blocks?.heading}
      </Heading>
      <Description dir="rtl" $data={sectionData} $isMobile={isMobile}>
        {sectionData.blocks?.description}
      </Description>

      <BrandsGrid
        ref={containerRef}
        $data={sectionData}
        $isMobile={isMobile}
        dir="rtl"
      >
        {sectionData.blocks?.brands.map((brand) => (
          <BrandCard
            className="border-l p-3"
            key={brand.id}
            $data={sectionData}
            style={{ cursor: "pointer" }}
          >
            <div
              className="relative "
              style={{
                width: `${sectionData.blocks?.setting?.logoWidth || 96}px`,
                height: `${sectionData.blocks?.setting?.logoHeight || 96}px`,
              }}
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain"
              />
            </div>
            <BrandName $data={sectionData}>{brand.name}</BrandName>
          </BrandCard>
        ))}
      </BrandsGrid>

      {/* Left Scroll Button with Animation */}
      <ScrollButton
        className="left"
        onClick={() => handleScroll("left")}
        $data={sectionData}
      >
        {" "}
        <BiChevronLeft size={24} />
      </ScrollButton>

      {/* Right Scroll Button with Animation */}
      <ScrollButton
        className="right"
        onClick={() => handleScroll("right")}
        $data={sectionData}
      >
        {" "}
        <BiChevronRight size={24} />
      </ScrollButton>
    </BrandsContainer>
  );
};
