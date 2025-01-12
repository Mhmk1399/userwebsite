"use client";
import { RichTextSection, RichTextBlock } from "@/lib/types";
import Link from "next/link";
import styled from "styled-components";

interface RichTextProps {
  sections: RichTextSection[];
  isMobile: boolean;
  componentName: string;
}

// Styled components
const Section = styled.section<{
  $data: RichTextSection;
}>`
  padding-top: ${(props) => props.$data?.setting?.paddingTop || "10"}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom || "10"}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft || "10"}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight || "10"}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop || "30"}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || "30"}px;
  background-color: ${(props) =>
    props.$data?.blocks?.setting?.background || "#ffffff"};
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  gap: 15px;
`;

const H1 = styled.h1<{
  $data: RichTextBlock;
}>`
  color: ${(props) => props.$data?.setting?.textHeadingColor || "#000"};
  font-size: ${(props) => props.$data?.setting?.textHeadingFontSize || "24"}px;
  font-weight: ${(props) =>
    props.$data?.setting?.textHeadingFontWeight || "bold"};
  // border-bottom: 3px solid #ffffff;
  padding-bottom: 10px;
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const P = styled.p<{
  $data: RichTextBlock;
}>`
  color: ${(props) => props.$data?.setting?.descriptionColor || "#666"};
  font-size: ${(props) => props.$data?.setting?.descriptionFontSize || "24"}px;
  font-weight: ${(props) =>
    props.$data?.setting?.descriptionFontWeight || "normal"};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Btn = styled.button<{
  $data: RichTextBlock;
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data?.setting?.btnTextColor || "#fff"};
  background-color: ${(props) =>
    props.$data?.setting?.btnBackgroundColor || "#007BFF"};
  padding: ${(props) => (props.$isMobile ? "7px 20px" : "15px 30px")};
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: transform 0.4s ease-in-out;
  &:hover {
    transform: scale(1.02);
    opacity: 0.8;
  }
`;

// Update the section data assignment with type checking
const RichText: React.FC<RichTextProps> = ({ sections, isMobile , componentName }) => {
  const sectionData = sections.find((section) => section.type === componentName);
  if (!sectionData) {
    return <div>No data available</div>;
  }

  // Add type guard to verify section type

  // Type guard for RichTextBlock

  return (
    <Section dir="rtl" $data={sectionData}>
      <H1 $data={sectionData.blocks}>{sectionData.blocks.textHeading}</H1>

      <hr className="w-[70%] h-[4px] bg-white mb-4" />

      <P $data={sectionData.blocks}>{sectionData.blocks.description}</P>
      <Btn $data={sectionData.blocks} $isMobile={isMobile}>
        <Link href={sectionData.blocks.btnLink} passHref legacyBehavior>
          {sectionData.blocks.btnText}
        </Link>
      </Btn>
    </Section>
  );
};

export default RichText;
