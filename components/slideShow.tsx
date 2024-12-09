"use client";
import styled from "styled-components";
import { useState } from "react";
import { SlideSection } from "@/lib/types";
import Link from "next/link";

interface SlideShowProps {
  sections: {
    slideshows: SlideSection[];
  };
  isMobile: boolean;
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

const SlideContainer = styled.div<{}>`
  width: 100%;
  max-width: 1000px;
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

const SlideImage = styled.img<{ $data: SlideSection["setting"] }>`
  width: 100%;
  border-radius: ${(props) => props.$data?.imageRadious || "10"}px;
  opacity: ${(props) => props.$data?.opacityImage || 1};
  object-fit: ${(props) => props.$data?.imageBehavior || "cover"};
`;

const SlideTextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

const SlideHeading = styled.h3<{
  $data: SlideSection["setting"];
}>`
  color: ${(props) => props.$data.textColor || "#000"};
  font-size: ${(props) => props.$data?.textFontSize || "22"}px;
  font-weight: ${(props) => props.$data.textFontWeight || "bold"};
  margin-top: 5px;
  text-align: center;
`;

const SlideDescription = styled.p<{
  $data: SlideSection["setting"];
}>`
  color: ${(props) => props.$data.descriptionColor || "#333"};
  font-size: ${(props) => props.$data?.descriptionFontSize || "22"}px;
  font-weight: ${(props) => props.$data.descriptionFontWeight || "normal"};
  padding: 20px;
  text-align: center;
  margin-top: 5px;
`;

const NavButton = styled.button<{ $isMobile: boolean }>`
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
  // @media (max-width: 425px) {
  //   transform: translateY(-490%);
  //   padding: 7px;
  // }
  @media (max-width: 768px) {
    transform: translateY(-360%);
    padding: 7px;
  }
`;

const PrevButton = styled(NavButton)<{ $isMobile: boolean }>`
  left: 5px;
`;

const NextButton = styled(NavButton)<{ $isMobile: boolean }>`
  right: 5px;
`;

const Button = styled.button<{
  $data: SlideSection["setting"];
}>`
  text-align: center;
  background-color: ${(props) =>
    props.$data?.setting?.btnBackgroundColor || "#007bff"};
  color: ${(props) => props.$data?.setting?.btnTextColor || "#fff"};
  padding: 10px 20px;
`;

const SlideShow: React.FC<SlideShowProps> = ({
  sections: { slideshows },
  isMobile,
}) => {
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const sectionData = slideshows[0];

  if (!sectionData) return null;

  const { blocks } = sectionData;

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % blocks.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + blocks.length) % blocks.length);

  return (
    <SectionSlideShow $data={sectionData} $isMobile={isMobile}>
      <SlideContainer>
        <SlidesWrapper $currentIndex={currentIndex}>
          {blocks.map((slide, index) => (
            <Slide key={index}>
              <SlideImage
                src={slide.imageSrc}
                alt={slide.imageAlt || "Slide"}
                $data={sectionData.setting}
              />
              <SlideTextBox>
                <SlideHeading $data={sectionData.setting}>
                  {slide.text}
                </SlideHeading>
                <SlideDescription $data={sectionData.setting}>
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
          ))}
        </SlidesWrapper>
        <PrevButton $isMobile={isMobile} onClick={handlePrev}>
          {"<"}
        </PrevButton>
        <NextButton $isMobile={isMobile} onClick={handleNext}>
          {">"}
        </NextButton>
      </SlideContainer>
    </SectionSlideShow>
  );
};
export default SlideShow;
