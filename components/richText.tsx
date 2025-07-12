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
  
  /* Apply button animations */
  ${(props) => {
    const btnAnimation = props.$data?.setting?.btnAnimation;
    if (!btnAnimation) return "";

    const { type, animation: animConfig } = btnAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: richTextBtnPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes richTextBtnPulse {
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
          animation: richTextBtnGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes richTextBtnGlow {
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
          animation: richTextBtnBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes richTextBtnBrightness {
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
          animation: richTextBtnBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes richTextBtnBlur {
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
          animation: richTextBtnSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes richTextBtnSaturate {
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
          animation: richTextBtnContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes richTextBtnContrast {
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
          animation: richTextBtnOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes richTextBtnOpacity {
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
          animation: richTextBtnShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes richTextBtnShadow {
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

// Update the section data assignment with type checking
const RichText: React.FC<RichTextProps> = ({
  sections,
  isMobile,
  componentName,
}) => {
  const sectionData = sections.find(
    (section) => section.type === componentName
  );
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
