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
  height: ${300}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "30"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "20"}px;
  overflow: hidden;
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
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 10;
`;

const NavButton = styled.button<{
  $data: SlideBannerSection;
}>`
  background: ${(props) =>
    props.$data.blocks.setting?.bgArrow || "rgba(255, 255, 255, 0.8)"};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 1);
  }
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
              width={isMobile ? 2000 : 2000}
              height={isMobile ? 2000 : 2000}
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
