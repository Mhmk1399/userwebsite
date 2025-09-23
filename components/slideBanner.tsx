"use client";
import styled from "styled-components";
import Image from "next/image";
import { SlideBannerSection } from "@/lib/types";
import { useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

interface SlideBannerProps {
  sections: SlideBannerSection[];
  isMobile: boolean;
  componentName: string;
}

const SlideBannerSections = styled.section<{
  $data: SlideBannerSection;
  $isMobile: boolean;
}>`
  position: relative;
  width: 100%;
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20"}px;
  padding-left: ${(props) => props.$data.setting?.paddingLeft || "20"}px;
  padding-right: ${(props) => props.$data.setting?.paddingRight || "20"}px;
  height: ${(props) => props.$data.blocks?.setting?.height || "20"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "30"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "20"}px;
  margin-left: ${(props) => props.$data.setting?.marginLeft || "20"}px;
  margin-right: ${(props) => props.$data.setting?.marginRight || "20"}px;
  overflow: hidden;
  box-shadow: ${(props) =>
    `${props.$data.blocks.setting?.shadowOffsetX || 0}px 
     ${props.$data.blocks.setting?.shadowOffsetY || 4}px 
     ${props.$data.blocks.setting?.shadowBlur || 10}px 
     ${props.$data.blocks.setting?.shadowSpread || 0}px 
     ${props.$data.blocks.setting?.shadowColor || "#fff"}`};
`;

const SlideContainer = styled.div<{ $isMobile: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Slide = styled.div<{
  $active: boolean;
  $data: SlideBannerSection;
  $isMobile: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.$active ? 1 : 0)};
  transition: opacity 0.7s ease-in-out;
`;

const NavigationButtons = styled.div`
  position: absolute;
  bottom: 10px;
  right: 20px;
  display: flex;
  gap: 5px;
  z-index: 10;
`;

const NavButton = styled.button<{
  $data: SlideBannerSection;
}>`
  background: ${(props) =>
    props.$data.blocks.setting?.bgArrow || "rgba(255, 255, 255, 0.8)"};
  border: none;
  border-radius: ${(props) => props.$data.blocks.setting.arrowRadius}px;
  width: ${(props) => props.$data.blocks.setting.arrowWidth}px;
  height: ${(props) => props.$data.blocks.setting.arrowHeight}px;
  display: flex;
  color: ${(props) => props.$data.blocks.setting.arrowColor};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => props.$data.blocks.setting.arrowBgHover || "#555"};
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
          animation: slideNavPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideNavPulse {
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
          animation: slideNavGlow ${animConfig.duration} ${animConfig.timing} ${
        animConfig.delay || "0s"
      } ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideNavGlow {
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
          animation: slideNavBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideNavBrightness {
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
          animation: slideNavBlur ${animConfig.duration} ${animConfig.timing} ${
        animConfig.delay || "0s"
      } ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideNavBlur {
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
          animation: slideNavSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideNavSaturate {
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
          animation: slideNavContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideNavContrast {
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
          animation: slideNavOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideNavOpacity {
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
          animation: slideNavShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideNavShadow {
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

const DotsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
`;

const Dot = styled.button<{ $active: boolean; $data: SlideBannerSection }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(props) =>
    props.$active
      ? props.$data.blocks.setting?.activeDotColor || "#ffffff"
      : props.$data.blocks.setting?.inactiveDotColor ||
        "rgba(255, 255, 255, 0.5)"};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const SlideBanner: React.FC<SlideBannerProps> = ({
  sections,
  isMobile,
  componentName,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionData = sections.find(
    (section) => section.type === componentName
  );

  if (!sectionData) return null;

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === (sectionData?.blocks?.slides?.length ?? 1) - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? (sectionData?.blocks?.slides?.length ?? 1) - 1 : prev - 1
    );
  };

  return (
    <SlideBannerSections $data={sectionData} $isMobile={isMobile} dir="rtl">
      <SlideContainer $isMobile={isMobile}>
        {sectionData.blocks.slides.map((slide, index) => (
          <Slide
            key={index}
            $active={currentSlide === index}
            $data={sectionData}
            $isMobile={isMobile}
          >
            <Image
              src={slide.imageSrc}
              alt={slide.imageAlt}
              width={isMobile ? 2000 : 3000}
              height={isMobile ? 2000 : 3000}
              className="w-full h-full "
              style={{ objectFit: "cover" }}
            />
          </Slide>
        ))}
      </SlideContainer>

      <NavigationButtons>
        <NavButton
          aria-label="previous button"
          onClick={prevSlide}
          $data={sectionData}
        >
          <BsChevronRight size={20} />
        </NavButton>
        <NavButton
          aria-label="next button"
          onClick={nextSlide}
          $data={sectionData}
        >
          <BsChevronLeft size={20} />
        </NavButton>
      </NavigationButtons>

      <DotsContainer>
        {sectionData.blocks.slides.map((_, index) => (
          <Dot
            $data={sectionData}
            aria-label="dot"
            key={index}
            $active={currentSlide === index}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </DotsContainer>
    </SlideBannerSections>
  );
};

export default SlideBanner;
