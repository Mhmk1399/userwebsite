"use client";
import { MultiRowSection, MultiRowBlock } from "@/lib/types";
import styled from "styled-components";

interface MultiRowShowProps {
  sections: MultiRowSection[];
  isMobile: boolean;
  componentName: string;
}

const Section = styled.section<{
  $data: MultiRowSection;
  $isMobile: boolean;
}>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20"}px;
  paddding-left: ${(props) => props.$data.setting?.paddingLeft || "0"}px;
  padding-right: ${(props) => props.$data.setting?.paddingRight || "0"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "20"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "20"}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorMultiRow || "#ffffff"};
  width: ${(props) => (props.$isMobile ? "auto" : "100%")};
  border-radius: 12px;
`;

const RowContainer = styled.div<{
  $isMobile: boolean;
}>`
  display: flex;
  flex-direction: column;
  items-center: center;
  justify-content: center;
  gap: ${(props) => (props.$isMobile ? "8px" : "16px")};
  padding: ${(props) => (props.$isMobile ? "10px" : "20px")};
`;

const Row = styled.div<{
  $data: MultiRowSection;
  $isMobile: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: ${(props) => (props.$isMobile ? "10px" : "20px")};
  padding: ${(props) => (props.$isMobile ? "15px" : "30px")};
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorBox || "#f9f9f9"};
  border-radius: 18px;
  @media (max-width: 426px) {
    flex-direction: column;
  }
`;

const ContentWrapper = styled.div<{
  $data: MultiRowSection;
  $isMobile: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${(props) => (props.$isMobile ? "18px" : "16px")};
  width: ${(props) => (props.$isMobile ? "100%" : "60%")};
`;

const Image = styled.img<{
  $data: MultiRowSection;
  $isMobile: boolean;
}>`
  width: ${(props) =>
    props.$isMobile ? "100%" : props.$data.setting?.imageWidth}px;
  height: ${(props) =>
    props.$isMobile ? "200px" : props.$data.setting?.imageHeight}px;
  object-fit: cover;
  border-radius: ${(props) => props.$data.setting?.imageRadius || "8px"}px;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: scale(1.01);
    opacity: 0.7;
    cursor: pointer;
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
          animation: multiRowImagePulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiRowImagePulse {
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
          animation: multiRowImageGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiRowImageGlow {
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
          animation: multiRowImageBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiRowImageBrightness {
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
          animation: multiRowImageBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiRowImageBlur {
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
          animation: multiRowImageSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiRowImageSaturate {
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
          animation: multiRowImageContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiRowImageContrast {
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
          animation: multiRowImageOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiRowImageOpacity {
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
          animation: multiRowImageShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiRowImageShadow {
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

const Title = styled.h2<{
  $data: MultiRowSection;
  $isMobile: boolean;
}>`
  font-size: ${(props) =>
    props.$isMobile ? "24" : props.$data.setting?.titleFontSize || "24"}px;
  color: ${(props) => props.$data?.setting?.titleColor || "#ffffff"};
  text-align: center;
  margin-bottom: ${(props) => (props.$isMobile ? "10px" : "20px")};
`;

const Heading = styled.h2<{
  $data: MultiRowSection;
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data.setting?.headingColor || "#333"};
  font-size: ${(props) =>
    props.$isMobile ? "22" : props.$data.setting?.headingFontSize || "24"}px;
  font-weight: ${(props) => props.$data.setting?.headingFontWeight || "bold"};
  text-align: center;
  @media (max-width: 768px) {
    font-size: 24px;
    margin-top: 10px;
  }
`;

const Description = styled.p<{
  $data: MultiRowSection;
  $isMobile: boolean;
}>`
  font-size: ${(props) =>
    props.$isMobile
      ? "14"
      : props.$data.setting?.descriptionFontSize || "16"}px;
  font-weight: ${(props) =>
    props.$data?.setting?.descriptionFontWeight || "normal"};
  color: ${(props) => props.$data.setting?.descriptionColor || "#666"};
  text-align: center;
  padding: ${(props) => (props.$isMobile ? "0 15" : "0 10")}px;
`;

const Button = styled.a<{
  $data: MultiRowSection;
  $isMobile: boolean;
}>`
  padding: ${(props) => (props.$isMobile ? "8px 20px" : "10px 30px")};
  font-size: ${(props) => (props.$isMobile ? "14px" : "16px")};
  background-color: ${(props) =>
    props.$data.setting?.btnBackgroundColor || "#007BFF"};
  color: ${(props) => props.$data.setting?.btnColor || "#fff"};
  border-radius: 5px;
  text-align: center;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  /* Apply button animations */

  ${(props) => {
    const buttonAnimation = props.$data.setting?.buttonAnimation;
    if (!buttonAnimation) return "";

    const { type, animation: animConfig } = buttonAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: multiRowButtonPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiRowButtonPulse {
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
          animation: multiRowButtonGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiRowButtonGlow {
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
          animation: multiRowButtonBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiRowButtonBrightness {
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
          animation: multiRowButtonBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiRowButtonBlur {
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
          animation: multiRowButtonSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiRowButtonSaturate {
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
          animation: multiRowButtonContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiRowButtonContrast {
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
          animation: multiRowButtonOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiRowButtonOpacity {
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
          animation: multiRowButtonShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes multiRowButtonShadow {
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

const MultiRow: React.FC<MultiRowShowProps> = ({
  sections,
  isMobile,
  componentName,
}) => {
  const sectionData = sections.find(
    (section) => section.type === componentName
  );
  if (!sectionData) return null;

  return (
    <Section
      $isMobile={isMobile}
      $data={sectionData}
      className={`transition-all duration-150 ease-in-out relative`}
    >
      <Title $data={sectionData} $isMobile={isMobile}>
        {sectionData.title}
      </Title>
      <RowContainer $isMobile={isMobile}>
        {(() => {
          // Handle both array and object structures
          let blocksToRender: MultiRowBlock[] = [];

          if (Array.isArray(sectionData.blocks)) {
            blocksToRender = sectionData.blocks;
          } else if (
            sectionData.blocks &&
            typeof sectionData.blocks === "object"
          ) {
            // Convert object to array, filtering out settings
            blocksToRender = Object.entries(sectionData.blocks)
              .filter(
                ([key, block]) =>
                  key !== "setting" && block && typeof block === "object"
              )
              .map((entry) => entry[1] as MultiRowBlock);
          }

          return blocksToRender.map((block, idx) => (
            <Row key={idx} $data={sectionData} $isMobile={isMobile}>
              <Image
                $isMobile={isMobile}
                src={block.imageSrc || "/default-image.jpg"}
                alt={block.imageAlt || ""}
                $data={sectionData}
              />
              <ContentWrapper $isMobile={isMobile} $data={sectionData}>
                <Heading $isMobile={isMobile} $data={sectionData}>
                  {block.heading}
                </Heading>
                <Description $data={sectionData} $isMobile={isMobile}>
                  {block.description}
                </Description>
                <Button
                  $isMobile={isMobile}
                  href={block.btnLink || "#"}
                  $data={sectionData}
                >
                  {block.btnLable || "Learn More"}
                </Button>
              </ContentWrapper>
            </Row>
          ));
        })()}
      </RowContainer>
    </Section>
  );
};

export default MultiRow;
