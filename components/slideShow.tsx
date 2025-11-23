"use client";
import styled from "styled-components";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { SlideSection, SlideBlock } from "@/lib/types";
import Link from "next/link";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import defaultImage from "@/public/assets/images/defaultimage.jpg";

const getImageSrc = (imageSrc: string) => {
  return imageSrc?.includes("https") ? imageSrc : defaultImage.src;
};

interface SlideShowProps {
  sections: SlideSection[];
  isMobile: boolean;
  componentName: string;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  currentX: number;
  startTime: number;
}

const SectionSlideShow = styled.section<{
  $data: SlideSection;
  $isMobile: boolean;
}>`
  position: relative;
  max-width: 100%;
  margin-top: ${(props) => props.$data.setting.marginTop}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom}px;
  margin-right: ${(props) => props.$data.setting.marginRight || 0}px;
  margin-left: ${(props) => props.$data.setting.marginLeft || 0}px;
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
  transition: background-color 0.3s ease;
  box-shadow: ${(props) =>
    `${props.$data.shadowOffsetX || 0}px 
     ${props.$data.shadowOffsetY || 4}px 
     ${props.$data.shadowBlur || 10}px 
     ${props.$data.shadowSpread || 0}px 
     ${props.$data.shadowColor || "#fff"}`};
`;

const SlideContainer = styled.div<{
  $isMobile: boolean;
}>`
  width: 100%;
  max-width: ${(props) => (props.$isMobile ? "400px" : "2000px")};
  overflow: hidden;
  border-radius: 16px;
`;

const SlidesWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Slide = styled.div`
  flex: 0 0 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;

  /* Smooth fade-in on slide change */
  animation: fadeIn 0.5s ease;
  @keyframes fadeIn {
    from {
      opacity: 0.6;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SlideImage = styled.img.withConfig({
  shouldForwardProp: (prop) => !prop.startsWith("$"),
})<{
  $data: SlideSection["setting"];
  $imageAnimation?: SlideSection["setting"]["imageAnimation"];
}>`
  width: ${(props) => {
    const w = props.$data?.imageWidth;
    if (!w) return "200px";
    return typeof w === "string" && w.includes("%") ? w : `${w}px`;
  }};
  height: ${(props) => props.$data?.imageHeight || "200"}px;
  max-width: 100%;
  position: relative;
  border-radius: ${(props) => props.$data?.imageRadious || "10"}px;
  opacity: ${(props) => props.$data?.opacityImage || 1};
  object-fit: ${(props) => props.$data?.imageBehavior || "cover"};
  transition: transform 0.4s ease, opacity 0.4s ease;

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
  margin-top: 15px;
  padding: 0 12px;
  text-align: center;
`;

const SlideHeading = styled.h3<{
  $data: SlideSection;
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data.setting.textColor || "#111"};
  font-size: ${(props) => props.$data?.setting.textFontSize || "22"}px;
  font-weight: ${(props) => props.$data.setting.textFontWeight || "600"};
  margin: 8px 0;
  letter-spacing: 0.3px;
`;

const SlideDescription = styled.p<{
  $data: SlideSection;
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data.setting.descriptionColor || "#555"};
  font-size: ${(props) => props.$data?.setting.descriptionFontSize || "18"}px;
  font-weight: ${(props) => props.$data.setting.descriptionFontWeight || "400"};
  line-height: 1.6;
  margin-top: 5px;
`;

const NavButton = styled.button<{
  $data: SlideSection;
  $navAnimation?: SlideSection["setting"]["navAnimation"];
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: ${(props) =>
    props.$data.navBg
      ? props.$data.navBg + "B3" // HEX + alpha (B3 = ~70%)
      : "rgba(85,85,85,0.7)"};
  color: ${(props) => props.$data.navColor || "#fff"};
  padding: 10px;
  border: none;
  border-radius: ${(props) => props.$data.navRadius || "2"}px;
  cursor: pointer;
  z-index: 10;
  @media (max-width: 425px) {
    padding: 4px;
  }
  @media (max-width: 768px) {
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
  $data: SlideSection;
  $btnAnimation?: SlideSection["setting"]["btnAnimation"];
}>`
  margin-top: 12px;
  text-align: center;
  background-color: ${(props) =>
    props.$data?.setting?.btnBackgroundColor || "#007bff"};
  color: ${(props) => props.$data?.setting?.btnTextColor || "#fff"};
  padding: 10px 22px;
  border: none;
  border-radius: ${(props) => props.$data?.setting?.btnRadius || "50"}px;
  cursor: pointer;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s ease;
  width: ${(props) => props.$data?.setting?.btnWidth || "100"}px;
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    currentX: 0,
    startTime: 0,
  });
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((clientX: number) => {
    setDragState({
      isDragging: true,
      startX: clientX,
      currentX: clientX,
      startTime: Date.now(),
    });
    setDragOffset(0);
  }, []);

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!dragState.isDragging || !containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const deltaX = clientX - dragState.startX;
      const offsetPercent = (deltaX / containerWidth) * 100;

      setDragOffset(offsetPercent);
      setDragState((prev) => ({ ...prev, currentX: clientX }));
    },
    [dragState.isDragging, dragState.startX]
  );

  const handleDragEnd = useCallback(() => {
    if (!dragState.isDragging || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = dragState.currentX - dragState.startX;
    const deltaTime = Date.now() - dragState.startTime;
    const velocity = Math.abs(deltaX) / deltaTime;

    const threshold = containerWidth * 0.25;
    const shouldChange = Math.abs(deltaX) > threshold || velocity > 0.5;

    const sectionData = sections.find(
      (section) => section.type === componentName
    );
    const blocks = Array.isArray(sectionData?.blocks) ? sectionData.blocks : [];
    const totalSlides = blocks.length;

    if (shouldChange) {
      if (deltaX > 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else if (deltaX < 0 && currentIndex < totalSlides - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    }

    setDragState({
      isDragging: false,
      startX: 0,
      currentX: 0,
      startTime: 0,
    });
    setDragOffset(0);
  }, [dragState, currentIndex, sections, componentName]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleDragStart(e.clientX);
    },
    [handleDragStart]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleDragStart(e.touches[0].clientX);
    },
    [handleDragStart]
  );

  useEffect(() => {
    if (!dragState.isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX);
    };

    const handleGlobalMouseUp = () => {
      handleDragEnd();
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      handleDragMove(e.touches[0].clientX);
    };

    const handleGlobalTouchEnd = () => {
      handleDragEnd();
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("touchmove", handleGlobalTouchMove);
    document.addEventListener("touchend", handleGlobalTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchmove", handleGlobalTouchMove);
      document.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, [dragState.isDragging, handleDragMove, handleDragEnd]);

  const sectionData = sections.find(
    (section) => section.type === componentName
  );
  const blocks = Array.isArray(sectionData?.blocks) ? sectionData.blocks : [];
  const totalSlides = blocks.length;

  const handleNext = () => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!sectionData) return null;
  const currentSlide: SlideBlock | undefined = blocks[currentIndex];

  return (
    <SectionSlideShow $isMobile={isMobile} $data={sectionData}>
      <SlideContainer $isMobile={isMobile}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "16px",
          }}
        >
          <SlidesWrapper>
            {currentSlide && (
              <Slide>
                <SlideImage
                  src={getImageSrc(currentSlide.imageSrc)}
                  alt={currentSlide.imageAlt || "Slide"}
                  $data={sectionData.setting}
                  $imageAnimation={sectionData.setting?.imageAnimation}
                />
                <SlideTextBox>
                  <SlideHeading
                    dir="rtl"
                    $isMobile={isMobile}
                    $data={sectionData}
                  >
                    {currentSlide.text}
                  </SlideHeading>
                  <SlideDescription
                    dir="rtl"
                    $isMobile={isMobile}
                    $data={sectionData}
                  >
                    {currentSlide.description}
                  </SlideDescription>
                  <Button
                    $data={sectionData}
                    $btnAnimation={sectionData.setting?.btnAnimation}
                  >
                    <Link
                      href={currentSlide.btnLink ? currentSlide.btnLink : "#"}
                      target="_blank"
                    >
                      {currentSlide.btnText
                        ? currentSlide.btnText
                        : "بیشتر بخوانید"}
                    </Link>
                  </Button>
                </SlideTextBox>
              </Slide>
            )}
          </SlidesWrapper>

          {totalSlides > 1 && (
            <>
              <PrevButton
                $data={sectionData}
                $navAnimation={sectionData.setting?.navAnimation}
                onClick={handlePrev}
                disabled={currentIndex === 0}
                style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
              >
                <BiChevronLeft size={24} />
              </PrevButton>
              <NextButton
                $data={sectionData}
                $navAnimation={sectionData.setting?.navAnimation}
                onClick={handleNext}
                disabled={currentIndex === totalSlides - 1}
                style={{ opacity: currentIndex === totalSlides - 1 ? 0.5 : 1 }}
              >
                <BiChevronRight size={24} />
              </NextButton>
            </>
          )}
        </div>
      </SlideContainer>
    </SectionSlideShow>
  );
};

export default SlideShow;
