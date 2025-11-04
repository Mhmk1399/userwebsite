"use client";
import React from "react";
import styled from "styled-components";
import { AnimationConfig, AnimationEffect } from "@/lib/types";
import Link from "next/link";
import defaultImage from "@/public/assets/images/banner2.webp"

const getImageSrc = (imageSrc: string) => {
  return imageSrc?.includes('https') ? imageSrc : defaultImage.src;
};
// Define types for the Canvas Editor
export interface CanvasElementStyle {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
  textAlign?: "left" | "right" | "center" | "justify" | "start" | "end";
  zIndex?: number;
}

export interface CanvasElement {
  id: string;
  type: "heading" | "paragraph" | "image" | "button" | "link" | "div";
  content?: string;
  style: CanvasElementStyle;
  href?: string;
  src?: string;
  alt?: string;
  animation?: AnimationEffect;
}

export interface CanvasEditorSection {
  type: string;
  setting: {
    paddingTop: string;
    paddingBottom: string;
    paddingLeft: string;
    paddingRight: string;
    marginTop: string;
    marginBottom: string;
    backgroundColor: string;
  };
  blocks: {
    elements: CanvasElement[];
    setting: {
      canvasWidth: string;
      canvasHeight: string;
      backgroundColor: string;
      gridSize: number;
      showGrid: boolean;
    };
  };
}

interface CanvasEditorProps {
  sections: CanvasEditorSection[];
  isMobile: boolean;
  componentName: string;
}

const CanvasContainer = styled.div<{
  $data: CanvasEditorSection;
  $isMobile: boolean;
}>`
  position: relative;
  width: ${(props) => props.$data.blocks.setting.canvasWidth};
  height: ${(props) =>
    props.$isMobile
      ? `${parseInt(props.$data.blocks.setting.canvasHeight) * 0.6}px`
      : props.$data.blocks.setting.canvasHeight};
  background-color: ${(props) => props.$data.blocks.setting.backgroundColor};
  overflow: hidden;
`;

const ElementWrapper = styled.div<{
  $element: CanvasElement;
  $isMobile: boolean;
  $animation?: AnimationEffect;
}>`
  position: absolute;
  left: ${(props) => props.$element.style.x * (props.$isMobile ? 0.6 : 1)}px;
  top: ${(props) => props.$element.style.y * (props.$isMobile ? 0.6 : 1)}px;
  width: ${(props) =>
    props.$element.style.width * (props.$isMobile ? 0.6 : 1)}px;
  height: ${(props) =>
    props.$element.style.height * (props.$isMobile ? 0.6 : 1)}px;
  z-index: ${(props) => props.$element.style.zIndex || 1};

  /* Apply animations using CSS filters and properties */
  ${(props) => {
    if (!props.$animation) return "";

    const { type, animation } = props.$animation;
    const selector =
      type === "hover" ? "&:hover" : type === "click" ? "&:active" : "";

    // Generate animation CSS based on type
    const generateAnimationCSS = (
      animType: string,
      config: AnimationConfig
    ) => {
      switch (animType) {
        case "pulse":
          return `
            ${selector} {
              animation: canvasPulse ${config.duration} ${config.timing} ${
            config.delay || "0s"
          } ${config.iterationCount || "1"};
            }
            
            @keyframes canvasPulse {
              0%, 100% { 
                opacity: 1;
                filter: brightness(1);
              }
              50% { 
                opacity: ${Math.max(0.3, 1 - 0.4)};
                filter: brightness(${1 + 0.3});
              }
            }
          `;
        case "glow":
          return `
            ${selector} {
              animation: canvasGlow ${config.duration} ${config.timing} ${
            config.delay || "0s"
          } ${config.iterationCount || "1"};
            }
            
            @keyframes canvasGlow {
              0%, 100% { 
                filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0));
              }
              50% { 
                filter: brightness(${
                  1 + 0.2
                }) drop-shadow(0 0 ${8}px rgba(255, 255, 255, ${0.6}));
              }
            }
          `;
        case "brightness":
          return `
            ${selector} {
              animation: canvasBrightness ${config.duration} ${config.timing} ${
            config.delay || "0s"
          } ${config.iterationCount || "1"};
            }
            
            @keyframes canvasBrightness {
              0%, 100% { 
                filter: brightness(1);
              }
              50% { 
                filter: brightness(${1 + 0.4});
              }
            }
          `;
        case "blur":
          return `
            ${selector} {
              animation: canvasBlur ${config.duration} ${config.timing} ${
            config.delay || "0s"
          } ${config.iterationCount || "1"};
            }
            
            @keyframes canvasBlur {
              0%, 100% { 
                filter: blur(0px);
              }
              50% { 
                filter: blur(${2}px);
              }
            }
          `;
        case "saturate":
          return `
            ${selector} {
              animation: canvasSaturate ${config.duration} ${config.timing} ${
            config.delay || "0s"
          } ${config.iterationCount || "1"};
            }
            
            @keyframes canvasSaturate {
              0%, 100% { 
                filter: saturate(1);
              }
              50% { 
                filter: saturate(${1 + 0.8});
              }
            }
          `;
        case "contrast":
          return `
            ${selector} {
              animation: canvasContrast ${config.duration} ${config.timing} ${
            config.delay || "0s"
          } ${config.iterationCount || "1"};
            }
            
            @keyframes canvasContrast {
              0%, 100% { 
                filter: contrast(1);
              }
              50% { 
                filter: contrast(${1 + 0.5});
              }
            }
          `;
        case "opacity":
          return `
            ${selector} {
              animation: canvasOpacity ${config.duration} ${config.timing} ${
            config.delay || "0s"
          } ${config.iterationCount || "1"};
            }
            
            @keyframes canvasOpacity {
              0% { 
                opacity: 1;
              }
              50% { 
                opacity: ${Math.max(0.2, 1 - 0.6)};
              }
              100% { 
                opacity: 1;
              }
            }
          `;
        case "shadow":
          return `
            ${selector} {
              animation: canvasShadow ${config.duration} ${config.timing} ${
            config.delay || "0s"
          } ${config.iterationCount || "1"};
            }
            
            @keyframes canvasShadow {
              0%, 100% { 
                filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
              }
              50% { 
                filter: drop-shadow(0 ${4}px ${8}px rgba(0, 0, 0, ${0.3}));
              }
            }
          `;
        default:
          return "";
      }
    };

    // Handle load animation differently

    return generateAnimationCSS(animation.type, animation);
  }}
`;

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  sections,
  isMobile,
  componentName,
}) => {
  // Get the section data from the layout
  const sectionData = sections.find(
    (section) => section.type === componentName
  );

  if (!sectionData) {
    return <div>داده‌ای برای این بخش وجود ندارد.</div>;
  }

  // Ensure blocks and elements exist
  const elements = sectionData.blocks?.elements || [];

  // Adjust element styles based on preview mode
  const getAdjustedStyle = (style: CanvasElementStyle) => {
    if (isMobile) {
      return {
        ...style,
        fontSize: style.fontSize
          ? Math.max(Math.floor(style.fontSize * 0.7), 10)
          : undefined,
        borderRadius: style.borderRadius
          ? Math.floor(style.borderRadius * 0.7)
          : undefined,
        padding: style.padding ? Math.floor(style.padding * 0.7) : undefined,
      };
    }
    return style;
  };

  // Render a canvas element based on its type
  const renderElement = (element: CanvasElement) => {
    const adjustedStyle = getAdjustedStyle(element.style);

    // Base styles
    const commonStyles: React.CSSProperties = {
      fontSize: adjustedStyle.fontSize
        ? `${adjustedStyle.fontSize}px`
        : undefined,
      fontWeight: adjustedStyle.fontWeight || undefined,
      color: adjustedStyle.color || undefined,
      backgroundColor: adjustedStyle.backgroundColor || undefined,
      borderRadius: adjustedStyle.borderRadius
        ? `${adjustedStyle.borderRadius}px`
        : undefined,
      padding: adjustedStyle.padding ? `${adjustedStyle.padding}px` : undefined,
      textAlign: adjustedStyle.textAlign,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent:
        adjustedStyle.textAlign === "center"
          ? "center"
          : adjustedStyle.textAlign === "left"
          ? "flex-start"
          : "flex-end",
      overflow: "hidden",
      transition: "all 300ms ease-in-out",
    };

    // Add animation classes based on animation type
    const getAnimationClasses = () => {
      let classes = "canvas-element";
      if (element.animation) {
        classes += ` ${element.animation.type}-animation`;
      }
      return classes;
    };

    switch (element.type) {
      case "heading":
        return (
          <h2 style={commonStyles} className={getAnimationClasses()}>
            {element.content}
          </h2>
        );
      case "paragraph":
        return (
          <p style={commonStyles} className={getAnimationClasses()}>
            {element.content}
          </p>
        );
      case "image":
        return (
          <img
            src={getImageSrc(element.src || defaultImage.src)}
            alt={element.alt || "Canvas image"}
            style={{
              ...commonStyles,
              objectFit: "cover",
            }}
            draggable={false}
            className={getAnimationClasses()}
          />
        );
      case "button":
        return (
          <Link href={element.href || "#"}>
            <button style={commonStyles} className={getAnimationClasses()}>
              {element.content}
            </button>
          </Link>
        );
      case "link":
        return (
          <a
            href={element.href || "#"}
            style={commonStyles}
            className={getAnimationClasses()}
          >
            {element.content}
          </a>
        );
      case "div":
        return <div style={commonStyles} className={getAnimationClasses()} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="transition-all duration-150 ease-in-out relative"
      style={{
        paddingTop: `${sectionData.setting.paddingTop}px`,
        paddingBottom: `${sectionData.setting.paddingBottom}px`,
        paddingLeft: `${sectionData.setting.paddingLeft}px`,
        paddingRight: `${sectionData.setting.paddingRight}px`,
        marginTop: `${sectionData.setting.marginTop}px`,
        marginBottom: `${sectionData.setting.marginBottom}px`,
        backgroundColor: sectionData.setting.backgroundColor,
      }}
    >
      <CanvasContainer
        $data={sectionData}
        $isMobile={isMobile}
        className="mx-auto"
      >
        {elements.map((element) => (
          <ElementWrapper
            key={element.id}
            $element={element}
            $isMobile={isMobile}
            $animation={element.animation}
          >
            {renderElement(element)}
          </ElementWrapper>
        ))}
      </CanvasContainer>
    </div>
  );
};

export default CanvasEditor;
