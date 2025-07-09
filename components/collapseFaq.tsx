"use client";
import {
  CollapseSection,
  CollapseBlock,
  CollapseBlockSetting,
} from "@/lib/types";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface CollapseFaqProps {
  sections: CollapseSection[];
  isMobile: boolean;
  componentName: string;
}

const Section = styled.section<{
  $data: CollapseSection;
  $isMobile: boolean;
}>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || 20}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || 20}px;
  padding-left: ${(props) => props.$data.setting?.paddingLeft || 20}px;
  padding-right: ${(props) => props.$data.setting?.paddingRight || 20}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || 20}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || 20}px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: ${(props) => props.$data.setting?.background || "#ffffff"};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  // width: ${(props) => (props.$isMobile ? "425px" : "100%")};
  // max-width: ${(props) => (props.$isMobile ? "425px" : "100%")};
`;

const Heading = styled.h2<{ $data: CollapseSection; $isMobile: boolean }>`
  color: ${(props) => props.$data.setting?.headingColor || "#333"};
  font-size: ${(props) => {
    const baseFontSize = props.$data.setting?.headingFontSize || 24;
    return props.$isMobile
      ? `${(baseFontSize as number) * 0.8}px`
      : `${baseFontSize}px`;
  }};
  font-weight: ${(props) => props.$data.setting?.headingFontWeight || "bold"};
  text-align: center;
  margin: 10px 0 20px;
`;

const FaqItem = styled.div<{ $isMobile: boolean }>`
  width: ${(props) => (props.$isMobile ? "90%" : "100%")};
  margin: 10px 0;
  padding: ${(props) => (props.$isMobile ? "8px" : "10px")};
`;

const Question = styled.div<{
  $block: CollapseBlock;
  $index: number;
  $isMobile: boolean;
  $globalAnimation?: any;
}>`
  font-size: ${(props) => {
    const baseFontSize =
      (props.$block.setting[
        `textFontSize${props.$index + 1}` as keyof CollapseBlockSetting
      ] as number) || 18;
    return props.$isMobile ? `${baseFontSize * 0.9}px` : `${baseFontSize}px`;
  }};
  font-weight: ${(props) =>
    (props.$block.setting[
      `textFontWeight${props.$index + 1}` as keyof CollapseBlockSetting
    ] as string) || "bold"};
  color: ${(props) =>
    (props.$block.setting[
      `textColor${props.$index + 1}` as keyof CollapseBlockSetting
    ] as string) || "#ffffff"};
  padding: ${(props) => (props.$isMobile ? "8px" : "10px")};
  cursor: pointer;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* Apply global animation to all accordion headers */
  ${(props) => {
    const animation = props.$globalAnimation;
    if (!animation) return "";

    const { type, animation: animConfig } = animation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: accordionHeaderPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes accordionHeaderPulse {
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
          animation: accordionHeaderGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes accordionHeaderGlow {
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
          animation: accordionHeaderBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes accordionHeaderBrightness {
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
          animation: accordionHeaderBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes accordionHeaderBlur {
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
          animation: accordionHeaderSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes accordionHeaderSaturate {
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
          animation: accordionHeaderContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes accordionHeaderContrast {
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
          animation: accordionHeaderOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes accordionHeaderOpacity {
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
          animation: accordionHeaderShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes accordionHeaderShadow {
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

const Answer = styled.div<{
  $block: CollapseBlock;
  $isOpen: boolean;
  $index: number;
  $isMobile: boolean;
}>`
  font-size: ${(props) => {
    const baseFontSize =
      (props.$block.setting[
        `contentFontSize${props.$index + 1}` as keyof CollapseBlockSetting
      ] as number) || 16;
    return props.$isMobile ? `${baseFontSize * 0.9}px` : `${baseFontSize}px`;
  }};
  font-weight: ${(props) =>
    (props.$block.setting[
      `contentFontWeight${props.$index + 1}` as keyof CollapseBlockSetting
    ] as string) || "normal"};
  color: ${(props) =>
    (props.$block.setting[
      `contentColor${props.$index + 1}` as keyof CollapseBlockSetting
    ] as string) || "#e4e4e4e4"};
  padding: ${(props) => (props.$isMobile ? "12px 15px" : "15px 20px")};
  text-align: right;
  background-color: transparent;
  max-height: ${(props) => (props.$isOpen ? "500px" : "0")};
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  overflow: hidden;
  transition: all 0.6s ease-in-out;
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
`;

const CollapseFaq: React.FC<CollapseFaqProps> = ({
  sections,
  isMobile,
  componentName,
}) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [blocks, setBlocks] = useState<CollapseBlock[]>([]);
  const sectionData = sections.find(
    (section) => section.type === componentName
  );

  useEffect(() => {
    if (sectionData?.blocks) {
      const blocksArray = Object.keys(sectionData.blocks)
        .filter((key) => !isNaN(Number(key)))
        .map((key) => sectionData.blocks[Number(key)]);
      setBlocks(blocksArray);
    }
  }, [sectionData]);

  if (!sectionData) {
    return <div>No data available</div>;
  }

  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <Section dir="rtl" $data={sectionData} $isMobile={isMobile}>
      <Heading $data={sectionData} $isMobile={isMobile}>
        {sectionData.blocks[0]?.heading}
      </Heading>

      {blocks.length > 0 ? (
        blocks.map((block: CollapseBlock, idx: number) => (
          <FaqItem key={idx} $isMobile={isMobile}>
            <Question
              $block={block}
              $index={idx}
              $isMobile={isMobile}
              $globalAnimation={sectionData.setting?.headerAnimation}
              onClick={(e) => {
                e.stopPropagation();
                toggleOpen(idx);
              }}
            >
              {
                block[
                  `text${idx + 1}` as keyof CollapseBlock
                ] as React.ReactNode
              }
              <span>{openIndexes.includes(idx) ? "-" : "+"}</span>
            </Question>
            <Answer
              $block={block}
              $isOpen={openIndexes.includes(idx)}
              $index={idx}
              $isMobile={isMobile}
            >
              {
                block[
                  `content${idx + 1}` as keyof CollapseBlock
                ] as React.ReactNode
              }
            </Answer>
          </FaqItem>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </Section>
  );
};

export default CollapseFaq;
