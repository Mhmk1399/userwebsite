"use client";
import styled from "styled-components";
import { ImageTextSection } from "@/lib/types";

interface ImageTextProps {
  sections: {
    ImageText: ImageTextSection[];
  };
  isMobile: boolean;
}

// Styled Components
const Section = styled.section<{
  $data: ImageTextSection;
  $isMobile: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) =>
    props.$data.blocks?.setting?.boxRadiuos || "10"}px;
  padding-top: ${(props) => props.$data.setting?.paddingTop || "0"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "0"}px;
  padding-left: ${(props) => props.$data.setting?.paddingLeft || "0"}px;
  padding-right: ${(props) => props.$data.setting?.paddingRight || "0"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "0"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "0"}px;
  background-color: ${(props) =>
    props.$data.blocks?.setting?.background || "transparent"};
  // flex-direction: ${(props) => (props.$isMobile ? "column" : "row")};
`;

const Image = styled.img<{
  $data: ImageTextSection;
}>`
  width: ${(props) => props.$data?.blocks?.setting?.imageWidth || "500"}0px;
  height: ${(props) => props.$data?.blocks?.setting?.imageHeight || "200"}0px;
  opacity: ${(props) => props.$data?.blocks?.setting?.opacityImage || "1"};
  border-radius: ${(props) =>
    props.$data?.blocks?.setting?.boxRadiuos || "10"}px;
  object-fit: cover;
`;

const TextContainer = styled.div<{
  $data: ImageTextSection;
  $isMobile: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$isMobile ? "center" : "flex-end")};
  text-align: ${(props) => (props.$isMobile ? "center" : "right")};
  padding: 20px;
  width: 100%;
  background-color: ${(props) =>
    props.$data.blocks?.setting?.backgroundColorBox};
  margin: 10px 0px;

  @media (max-width: 425px) {
    align-items: center;
    text-align: center;
    margin: 10px;
  }
`;

const Heading = styled.h2<{
  $data: ImageTextSection;
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data.blocks?.setting?.headingColor || "#333"};
  font-size: ${(props) =>
    props.$isMobile
      ? "22"
      : props.$data.blocks?.setting?.headingFontSize || "30"}px;
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.headingFontWeight || "bold"};
  margin-bottom: 10px;
`;

const Description = styled.p<{
  $data: ImageTextSection;
  $isMobile: boolean;
}>`
  color: ${(props) =>
    props.$data.blocks?.setting?.descriptionColor || "#666666"};
  font-size: ${(props) =>
    props.$isMobile
      ? "18"
      : props.$data?.blocks?.setting?.descriptionFontSize || "24"}px;
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.descriptionFontWeight || "normal"};
  margin-bottom: 20px;
`;

const Button = styled.a<{ $data: ImageTextSection }>`
  display: inline-block;
  padding: 10px 20px;
  color: ${(props) => props.$data.blocks?.setting?.btnTextColor || "#fff"};
  background-color: ${(props) =>
    props.$data.blocks?.setting?.btnBackgroundColor || "#007bff"};
  text-decoration: none;
  border-radius: 5px;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

// Main Component
const ImageText: React.FC<ImageTextProps> = ({
  sections: { ImageText },
  isMobile,
}) => {
  // Find the first section with type "image-text"
  const sectionData = ImageText[0];

  // Fallback for missing or invalid section data
  if (!sectionData) {
    return null;
  }

  const { imageSrc, imageAlt, heading, description, btnLink, btnText } =
    sectionData.blocks;

  return (
    <Section $isMobile={isMobile} $data={sectionData}>
      <Image
        className="rounded-xl "
        $data={sectionData}
        src={imageSrc || "/assets/images/banner2.webp"}
        alt={imageAlt || "Image"}
      />
      <TextContainer $isMobile={isMobile} $data={sectionData}>
        <Heading $isMobile={isMobile} $data={sectionData}>
          {heading || "Default Heading"}
        </Heading>
        <Description $isMobile={isMobile} $data={sectionData}>
          {description ||
            "Pair text with an image to focus on your chosen product, collection, or blog post. Add details on availability, style, or even provide a review."}
        </Description>
        {btnLink && (
          <Button $data={sectionData} href={btnLink}>
            {btnText || "Learn More"}
          </Button>
        )}
      </TextContainer>
    </Section>
  );
};

export default ImageText;
