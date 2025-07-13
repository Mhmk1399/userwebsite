"use client";
import styled from "styled-components";
import React, { useState } from "react";
import { SlideSection, SlideBlock } from "@/lib/types";
import Link from "next/link";

interface SlideShowProps {
  sections: SlideSection[];
  isMobile: boolean;
  componentName: string;
}

const SectionSlideShow = styled.section<{
  $data: SlideSection;
  $isMobile: boolean;
}>`
  position: relative;
  margin: 0px 10px;
  margin-top: ${(props) => props.$data.setting.marginTop}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom}px;
  padding-top: ${(props) => props.$data.setting.paddingTop}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom}px;
  padding-left: ${(props) => props.$data.setting.paddingLeft}px;
  padding-right: ${(props) => props.$data.setting.paddingRight}px;
  background-color: ${(props) =>
    props.$data.setting.backgroundColorBox || "transparent"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SlideContainer = styled.div<{
  $isMobile: boolean;
}>`
  width: 100%;
  max-width: ${(props) => (props.$isMobile ? "400px" : "800px")};
  overflow: hidden;
  position: relative;
`;

const SlidesWrapper = styled.div<{ $currentIndex: number }>`
  display: flex;
  transition: transform 0.6s ease-in-out;
  transform: translateX(${(props) => props.$currentIndex * -100}%);
`;

const Slide = styled.div`
  flex: 0 0 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SlideImage = styled.img<{
  $data: SlideSection["setting"];
  $imageAnimation?: SlideSection["setting"]["imageAnimation"];
}>`
  width: 100%;
  border-radius: ${(props) => props.$data?.imageRadious || "10"}px;
  opacity: ${(props) => props.$data?.opacityImage || 1};
  object-fit: ${(props) => props.$data?.imageBehavior || "cover"};
  /* Apply image animations */
  ${(props) => {
    const imageAnimation = props.$imageAnimation;
    if (!imageAnimation) return "";

    const { type, animation: animConfig } = imageAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      const baseOpacity = Number(props.$data?.opacityImage || 1);
      return `
        ${selector} {
          animation: slideImagePulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideImagePulse {
          0%, 100% { 
            opacity: ${baseOpacity};
            filter: brightness(1);
          }
          50% { 
            opacity: ${Math.max(0.3, baseOpacity - 0.4)};
            filter: brightness(1.3);
          }
        }
      `;
    } else if (animConfig.type === "glow") {
      return `
        ${selector} {
          animation: slideImageGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideImageGlow {
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
          animation: slideImageBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideImageBrightness {
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
          animation: slideImageBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideImageBlur {
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
          animation: slideImageSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideImageSaturate {
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
          animation: slideImageContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideImageContrast {
          0%, 100% { 
            filter: contrast(1);
          }
          50% { 
            filter: contrast(1.5);
          }
        }
      `;
    } else if (animConfig.type === "opacity") {
      const baseOpacity = Number(props.$data?.opacityImage || 1);
      return `
        ${selector} {
          animation: slideImageOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideImageOpacity {
          0% { 
            opacity: ${baseOpacity};
          }
          50% { 
            opacity: ${Math.max(0.2, baseOpacity - 0.6)};
          }
          100% { 
            opacity: ${baseOpacity};
          }
        }
      `;
    } else if (animConfig.type === "shadow") {
      return `
        ${selector} {
          animation: slideImageShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideImageShadow {
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

const SlideTextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

const SlideHeading = styled.h3<{
  $data: SlideSection["setting"];
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data.textColor || "#000"};
  font-size: ${(props) =>
    props.$isMobile ? "18" : props.$data?.textFontSize || "22"}px;
  font-weight: ${(props) => props.$data.textFontWeight || "bold"};
  margin-top: 5px;
  text-align: center;
`;

const SlideDescription = styled.p<{
  $data: SlideSection["setting"];
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data.descriptionColor || "#333"};
  font-size: ${(props) =>
    props.$isMobile ? "14" : props.$data?.descriptionFontSize || "22"}px;
  font-weight: ${(props) => props.$data.descriptionFontWeight || "normal"};
  padding: 20px;
  text-align: center;
  margin-top: 5px;
`;

const NavButton = styled.button<{
  $navAnimation?: SlideSection["setting"]["navAnimation"];
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-250%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  border: none;
  border-radius: 20%;
  cursor: pointer;
  z-index: 10;
  @media (max-width: 425px) {
    transform: translateY(-390%);
    padding: 7px;
  }
  @media (max-width: 768px) {
    transform: translateY(-290%);
    padding: 7px;
  }
  /* Apply navigation button animations */
  ${(props) => {
    const navAnimation = props.$navAnimation;
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

const PrevButton = styled(NavButton)`
  left: 5px;
`;

const NextButton = styled(NavButton)`
  right: 5px;
`;

const Button = styled.button<{
  $data: SlideSection["setting"];
  $btnAnimation?: SlideSection["setting"]["btnAnimation"];
}>`
  text-align: center;
  background-color: ${(props) =>
    props.$data?.setting?.btnBackgroundColor || "#007bff"};
  color: ${(props) => props.$data?.setting?.btnTextColor || "#fff"};
  padding: 10px 20px;
  /* Apply button animations */
  ${(props) => {
    const btnAnimation = props.$btnAnimation;
    if (!btnAnimation) return "";

    const { type, animation: animConfig } = btnAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: slideBtnPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideBtnPulse {
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
          animation: slideBtnGlow ${animConfig.duration} ${animConfig.timing} ${
        animConfig.delay || "0s"
      } ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideBtnGlow {
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
          animation: slideBtnBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideBtnBrightness {
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
          animation: slideBtnBlur ${animConfig.duration} ${animConfig.timing} ${
        animConfig.delay || "0s"
      } ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideBtnBlur {
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
          animation: slideBtnSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideBtnSaturate {
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
          animation: slideBtnContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideBtnContrast {
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
          animation: slideBtnOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideBtnOpacity {
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
          animation: slideBtnShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes slideBtnShadow {
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

const SlideShow: React.FC<SlideShowProps> = ({
  sections,
  isMobile,
  componentName,
}) => {
  console.log(componentName);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionData = sections.find(
    (section) => section.type === componentName
  );

    if (!sectionData) return null;


  const { blocks } = sectionData;

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % blocks.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + blocks.length) % blocks.length);

  return (
    <SectionSlideShow $isMobile={isMobile} $data={sectionData}>
      <SlideContainer $isMobile={isMobile}>
        <SlidesWrapper $currentIndex={currentIndex}>
          {blocks.map((slide: SlideBlock, index: number) => (
            <Slide key={index}>
              <SlideImage
                src={slide.imageSrc}
                alt={slide.imageAlt || "Slide"}
                $data={sectionData.setting}
              />
              <SlideTextBox>
                <SlideHeading $isMobile={isMobile} $data={sectionData.setting}>
                  {slide.text}
                </SlideHeading>
                <SlideDescription
                  $isMobile={isMobile}
                  $data={sectionData.setting}
                >
                  {slide.description}
                </SlideDescription>
                <Button $data={sectionData.setting}>
                  <Link
                    href={slide.btnLink ? slide.btnLink : "#"}
                    target="_blank"
                  >
                    {slide.btnText ? slide.btnText : "بیشتر بخوانید"}
                  </Link>
                </Button>
              </SlideTextBox>
            </Slide>
          ))}{" "}
        </SlidesWrapper>
        <PrevButton onClick={handlePrev}>{"<"}</PrevButton>
        <NextButton onClick={handleNext}>{">"}</NextButton>
      </SlideContainer>
    </SectionSlideShow>
  );
};

export default SlideShow;
