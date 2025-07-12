"use client";
import styled from "styled-components";
import Image from "next/image";
import { useRef } from "react";
import type { BrandsSection } from "@/lib/types";

interface BrandsProps {
  sections: BrandsSection[];
  isMobile: boolean;
  componentName: string;
}

const BrandsContainer = styled.div<{
  $data: BrandsSection;
}>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || "5"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "5"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "2"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "2"}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColor || "#FFFFFF"};
  border-radius: ${(props) => props.$data.setting?.borderRadius || "20"}px;
  border: ${(props) => props.$data.setting?.border || "1px solid #E0E0E0"};
`;

const Heading = styled.h2<{
  $data: BrandsSection;
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data.blocks?.setting?.headingColor || "#14213D"};
  font-size: ${(props) =>
    props.$isMobile
      ? "24px"
      : `${props.$data.blocks?.setting?.headingFontSize || "32"}px`};
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.headingFontWeight || "bold"};
  text-align: center;
  margin-bottom: 2rem;
`;

const BrandsGrid = styled.div<{
  $data: BrandsSection;
  $isMobile: boolean;
}>`
  display: flex;
  flex-wrap: nowrap;
  justify-content: start;
  overflow-x: scroll;
  scroll-behavior: smooth;

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
  background: #ffffff;
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
    // Optionally render nothing or a fallback UI if sectionData is not found
    return null;
  }

  return (
    <div className={`transition-all duration-150 ease-in-out relative`}>
      <BrandsContainer
        $data={sectionData}
        className={`transition-all duration-150 ease-in-out relative `}
      >
        <Heading $data={sectionData} $isMobile={isMobile}>
          {sectionData.blocks?.heading}
        </Heading>

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
          className="left bg-white"
          onClick={() => handleScroll("left")}
          $data={sectionData}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
          </svg>
        </ScrollButton>

        {/* Right Scroll Button with Animation */}
        <ScrollButton
          className="right bg-white"
          onClick={() => handleScroll("right")}
          $data={sectionData}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </ScrollButton>
      </BrandsContainer>
    </div>
  );
};
