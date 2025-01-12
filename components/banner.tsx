"use client";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { BannerSection } from "@/lib/types";

interface props {
  sections: BannerSection[];
  isMobile: boolean;
  componentName: string;
}

const SectionBanner = styled.section<{
  $data: BannerSection;
  $isMobile: boolean;
}>`
  position: relative;
  height: 600px;
  margin: 0px 10px;
  margin-top: ${(props) => props.$data.setting.marginTop}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom}px;
  padding-top: ${(props) => props.$data.setting.paddingTop}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom}px;
  padding-left: ${(props) => props.$data.setting.paddingLeft}px;
  padding-right: ${(props) => props.$data.setting.paddingRight}px;
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const BannerImage = styled(Image)<{
  $data: BannerSection;
}>`
  opacity: ${(props) => props.$data?.blocks?.setting?.opacityImage || "1"};
  border-radius: ${(props) =>
    props.$data?.blocks?.setting?.imageRadious || "10px"};
  object-fit: ${(props) =>
    props.$data?.blocks?.setting?.imageBehavior || "cover"};
`;

const BannerTextBox = styled.div<{
  $data: BannerSection;
  $isMobile: boolean;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => props.$data?.blocks?.setting?.opacityTextBox || "1"};
  background-color: ${(props) =>
    props.$data?.blocks?.setting?.backgroundColorBox || "rgba(0, 0, 0, 0.5)"};
  padding: ${(props) => (props.$isMobile ? "20px" : "40px")};
  border-radius: ${(props) =>
    props.$data?.blocks?.setting?.backgroundBoxRadious || "10"}px;
`;

const HeadingText = styled.h2<{
  $data: BannerSection;
}>`
  color: ${(props) => props.$data?.blocks?.setting?.textColor || "#ffffff"};
  font-size: ${(props) => props.$data?.blocks?.setting?.textFontSize || "18"}px;
  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.textFontWeight || "bold"};
  text-align: center;
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const DescriptionText = styled.p<{
  $data: BannerSection;
}>`
  color: ${(props) =>
    props.$data?.blocks?.setting?.descriptionColor || "#ffffff"};
  font-size: ${(props) =>
    props.$data?.blocks?.setting?.descriptionFontSize || "20"}px;
  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.descriptionFontWeight || "normal"};
  margin-top: 14px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Banner: React.FC<props> = ({ sections, isMobile ,componentName}) => {
  const sectionData = sections.find((section) => section.type === componentName);
  if (!sectionData) {
    return <div>No data available</div>;
  }


  const { description, imageAlt, imageSrc, text } = sectionData?.blocks;

  return (
    <SectionBanner $data={sectionData} $isMobile={isMobile}>
      <Link
        href={sectionData.blocks.imageLink || "/"}
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          height: "100%",
        }}
      >
        <BannerImage
          $data={sectionData}
          alt={imageAlt || "banner"}
          src={imageSrc || "/assets/images/banner2.webp"}
          fill
          priority
        />
      </Link>
      <BannerTextBox $data={sectionData} $isMobile={isMobile}>
        <HeadingText $data={sectionData}>{text || "سربرگ بنر"}</HeadingText>
        <DescriptionText $data={sectionData}>
          {description || "توضیحات بنر"}
        </DescriptionText>
      </BannerTextBox>
    </SectionBanner>
  );
};

export default Banner;
