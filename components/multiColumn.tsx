"use client";
import { MultiColumnSection } from "@/lib/types";
import styled from "styled-components";

interface MultiColumnProps {
  sections: MultiColumnSection[];
  isMobile: boolean;
  componentName: string;
}
const Section = styled.section<{
  $data: MultiColumnSection;
  $isMobile: boolean;
}>`
  padding-top: ${(props) =>
    props.$isMobile ? "10" : props.$data.setting?.paddingTop || "20"}px;
  padding-bottom: ${(props) =>
    props.$isMobile ? "10" : props.$data.setting?.paddingBottom || "20"}px;
  padding-right: ${(props) =>
    props.$isMobile ? "10" : props.$data.setting?.paddingRight || "20"}px;
  padding-left: ${(props) =>
    props.$isMobile ? "10" : props.$data.setting?.paddingLeft || "20"}px;
  margin-top: ${(props) =>
    props.$isMobile ? "10" : props.$data.setting?.marginTop || "20"}px;
  margin-bottom: ${(props) =>
    props.$isMobile ? "10" : props.$data.setting?.marginBottom || "20"}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorBox || "#ffffff"};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${(props) => (props.$isMobile ? "10" : "15")}px;
  border-radius: 12px;
  width: ${(props) => (props.$isMobile ? "100%" : "auto")}px;
  margin-left: ${(props) => (props.$isMobile ? "5" : "10")}px;
  margin-right: ${(props) => (props.$isMobile ? "5" : "10")}px;
`;

const Heading = styled.h2<{
  $data: MultiColumnSection;
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data.setting?.headingColor || "#333"};
  font-size: ${(props) => {
    const baseSize = props.$data.setting?.headingFontSize || 24;
    return props.$isMobile
      ? `${(baseSize as number) * 0.8}px`
      : `${baseSize}px`;
  }};
  font-weight: ${(props) => props.$data.setting?.headingFontWeight || "bold"};
  text-align: center;
  margin-bottom: ${(props) => (props.$isMobile ? "10px" : "20px")};
`;

const ColumnContainer = styled.div<{
  $isMobile: boolean;
}>`
  // display: flex;
  gap: ${(props) => (props.$isMobile ? "10px" : "20px")};
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: ${(props) => (props.$isMobile ? "column" : "row")};
  @media (max-width: 769px) {
    flex-direction: ${(props) => (props.$isMobile ? "column" : "row")};
  }
`;

const Column = styled.div<{
  $data: MultiColumnSection;
  $isMobile: boolean;
}>`
  padding: ${(props) => (props.$isMobile ? "10px" : "20px")};
  border-radius: ${(props) => props.$data.setting?.imageRadious || "8px"}px;
  text-align: center;
  width: ${(props) => (props.$isMobile ? "100%" : "30%")};
  min-height: ${(props) => (props.$isMobile ? "auto" : "600px")};
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`;

const Title = styled.h3<{
  $data: MultiColumnSection;
  $isMobile: boolean;
}>`
  font-size: ${(props) => {
    const baseSize = props.$data.setting?.titleFontSize || 24;
    return props.$isMobile ? `${(baseSize as number) * 0.8}` : `${baseSize}`;
  }}px;
  font-weight: ${(props) => props.$data.setting?.titleFontWeight || "bold"};
  color: ${(props) => props.$data.setting?.titleColor || "#ffffff"};
  margin-bottom: ${(props) => (props.$isMobile ? "5px" : "10px")};
  min-height: ${(props) => (props.$isMobile ? "40px" : "60px")};
`;

const Image = styled.img<{
  $data: MultiColumnSection;
}>`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  border-radius: ${(props) => props.$data.setting?.imageRadious || "5px"}px;
  margin-bottom: 10px;
  transition: all 0.5s ease-in-out;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }

  /* Default hover effect */
  &:hover {
    transform: scale(0.95);
  }

  /* Apply image animations */
  ${(props) => {
    const imageAnimation = props.$data.setting?.imageAnimation;
    if (!imageAnimation) return "";

    const { type, animation: animConfig } = imageAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: multiColumnImagePulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          transform: none; /* Override default transform */
        }
        
        @keyframes multiColumnImagePulse {
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
          animation: multiColumnImageGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          transform: none; /* Override default transform */
        }
        
        @keyframes multiColumnImageGlow {
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
          animation: multiColumnImageBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          transform: none; /* Override default transform */
        }
        
        @keyframes multiColumnImageBrightness {
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
          animation: multiColumnImageBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          transform: none; /* Override default transform */
        }
        
        @keyframes multiColumnImageBlur {
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
          animation: multiColumnImageSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          transform: none; /* Override default transform */
        }
        
        @keyframes multiColumnImageSaturate {
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
          animation: multiColumnImageContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          transform: none; /* Override default transform */
        }
        
        @keyframes multiColumnImageContrast {
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
          animation: multiColumnImageOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          transform: none; /* Override default transform */
        }
        
        @keyframes multiColumnImageOpacity {
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
          animation: multiColumnImageShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          transform: none; /* Override default transform */
        }
        
        @keyframes multiColumnImageShadow {
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

const Description = styled.p<{
  $data: MultiColumnSection;
  $isMobile: boolean;
}>`
  font-size: ${(props) => {
    const baseSize = props.$data.setting?.descriptionFontSize || 16;
    return props.$isMobile ? `${(baseSize as number) * 0.9}` : `${baseSize}`;
  }}px;
  font-weight: ${(props) =>
    props.$data.setting?.descriptionFontWeight || "normal"};
  color: ${(props) => props.$data.setting?.descriptionColor || "#ffffff"};
  margin-bottom: ${(props) => (props.$isMobile ? "10px" : "15px")};
  // min-height: ${(props) => (props.$isMobile ? "80px" : "110px")};
  // max-height: ${(props) => (props.$isMobile ? "120px" : "150px")};
  overflow-y: visible;
`;

const Button = styled.a<{
  $data: MultiColumnSection;
}>`
  display: inline-block;
  padding: 10px 30px;
  background-color: ${(props) =>
    props.$data.setting?.btnBackgroundColor || "#000"};
  color: ${(props) => props.$data.setting?.btnColor || "#fff"};
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.5s ease-in-out;

  /* Default hover effect */
  &:hover {
    opacity: 0.7;
  }

  @media (max-width: 480px) {
    padding: 8px 20px;
    font-size: 14px;
  }

  /* Apply button animations */
  ${(props) => {
    const btnAnimation = props.$data.setting?.btnAnimation;
    if (!btnAnimation) return "";

    const { type, animation: animConfig } = btnAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: multiColumnBtnPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          opacity: 1; /* Override default opacity */
        }
        
        @keyframes multiColumnBtnPulse {
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
          animation: multiColumnBtnGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          opacity: 1; /* Override default opacity */
        }
        
        @keyframes multiColumnBtnGlow {
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
          animation: multiColumnBtnBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          opacity: 1; /* Override default opacity */
        }
        
        @keyframes multiColumnBtnBrightness {
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
          animation: multiColumnBtnBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          opacity: 1; /* Override default opacity */
        }
        
        @keyframes multiColumnBtnBlur {
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
          animation: multiColumnBtnSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          opacity: 1; /* Override default opacity */
        }
        
        @keyframes multiColumnBtnSaturate {
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
          animation: multiColumnBtnContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          opacity: 1; /* Override default opacity */
        }
        
        @keyframes multiColumnBtnContrast {
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
          animation: multiColumnBtnOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiColumnBtnOpacity {
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
          animation: multiColumnBtnShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          opacity: 1; /* Override default opacity */
        }
        
        @keyframes multiColumnBtnShadow {
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

const MultiColumn: React.FC<MultiColumnProps> = ({
  sections,
  isMobile,
  componentName,
}) => {
  const sectionData = sections.find(
    (section) => section.type === componentName
  );
  if (!sectionData) return null;


  return (
    <Section $isMobile={isMobile} $data={sectionData}>
      <Heading $data={sectionData} $isMobile={isMobile}>
        {sectionData?.setting.heading || "heading"}
      </Heading>
      {/* // Replace the existing mapping code with this: */}
      <ColumnContainer $isMobile={isMobile}>
        {Object.entries(sectionData.blocks).map(([key, block], idx) => {
          if (key === "setting") return null;
          const index = Number(key);
          if (isNaN(index)) return null;
          const typedBlock = block as MultiColumnSection;
          return (
            <Column key={idx} $data={sectionData} $isMobile={isMobile}>
              <Title $data={sectionData} $isMobile={isMobile}>
                {
                  typedBlock[
                    `title${index + 1}` as keyof MultiColumnSection
                  ] as React.ReactNode
                }
              </Title>
              <Description $data={sectionData} $isMobile={isMobile}>
                {
                  typedBlock[
                    `description${index + 1}` as keyof MultiColumnSection
                  ] as React.ReactNode
                }
              </Description>
              <Image
                src={
                  (typedBlock[
                    `imageSrc${index + 1}` as keyof MultiColumnSection
                  ] as string) || "/assets/images/banner2.webp"
                }
                alt={
                  (typedBlock[
                    `imageAlt${index + 1}` as keyof MultiColumnSection
                  ] as string) || ""
                }
                $data={sectionData}
              />
              <Button
                href={
                  (typedBlock[
                    `btnLink${index + 1}` as keyof MultiColumnSection
                  ] as string) || ""
                }
                $data={sectionData}
              >
                {(typedBlock[
                  `btnLable${index + 1}` as keyof MultiColumnSection
                ] as React.ReactNode) || "بیشتر"}
              </Button>
            </Column>
          );
        })}{" "}
      </ColumnContainer>
    </Section>
  );
};

export default MultiColumn;
