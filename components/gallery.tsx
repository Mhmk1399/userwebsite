"use client";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { GallerySection } from "@/lib/types";

interface GalleryProps {
  sections: GallerySection[];
  isMobile: boolean;
  componentName: string;
}

const Section = styled.section<{
  $data: GallerySection;
  $isMobile: boolean;
}>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "10"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "10"}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColor || "#ffffff"};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${(props) => (props.$isMobile ? "100%" : "auto")};
`;

const Title = styled.h2<{
  $data: GallerySection;
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data.blocks.setting?.titleColor || "#000000"};
  font-size: ${(props) =>
    props.$isMobile
      ? "18px"
      : props.$data.blocks.setting?.titleFontSize || "24px"};
  font-weight: ${(props) =>
    props.$data.blocks.setting?.titleFontWeight || "bold"};
  margin-bottom: 20px;
`;

const Description = styled.p<{
  $data: GallerySection;
  $isMobile: boolean;
}>`
  color: ${(props) =>
    props.$data.blocks.setting?.descriptionColor || "#666666"};
  font-size: ${(props) =>
    props.$isMobile
      ? "14px"
      : props.$data.blocks.setting?.descriptionFontSize || "16px"};
  font-weight: ${(props) =>
    props.$data.blocks.setting?.descriptionFontWeight || "normal"};
  margin-bottom: 30px;
  text-align: center;
`;

const ImageGrid = styled.div<{
  $data: GallerySection;
  $isMobile: boolean;
}>`
  display: grid;
  grid-template-columns: repeat(
    ${(props) =>
      props.$isMobile ? "2" : props.$data.blocks.setting?.gridColumns || "3"},
    1fr
  );
  gap: ${(props) => props.$data.blocks.setting?.gridGap || "10"}px;
  padding: 0 20px;
  width: ${(props) => (props.$isMobile ? "100%" : "auto")};
`;

const ImageWrapper = styled.div<{
  $data: GallerySection;
  $isMobile: boolean;
}>`
  position: relative;
  height: ${(props) =>
    props.$isMobile
      ? "150px"
      : props.$data.blocks.setting?.imageHeight || "200px"};
  width: ${(props) =>
    props.$isMobile
      ? "100%"
      : props.$data.blocks.setting?.imageWidth || "200px"};
  border-radius: ${(props) => props.$data.blocks.setting?.imageRadius || "8"}px;
  overflow: hidden;
  transition: transform 0.3s ease;
  object-fit: fill;

  /* Apply image animations */
  ${(props) => {
    const imageAnimation = props.$data.blocks?.setting?.imageAnimation;
    if (!imageAnimation) return "&:hover { transform: scale(1.05); }";

    const { type, animation: animConfig } = imageAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: galleryImagePulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes galleryImagePulse {
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
          animation: galleryImageGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes galleryImageGlow {
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
          animation: galleryImageBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes galleryImageBrightness {
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
          animation: galleryImageBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes galleryImageBlur {
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
          animation: galleryImageSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes galleryImageSaturate {
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
          animation: galleryImageContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes galleryImageContrast {
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
          animation: galleryImageOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes galleryImageOpacity {
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
          animation: galleryImageShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes galleryImageShadow {
          0%, 100% { 
            filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
          }
          50% { 
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          }
        }
      `;
    }

    // Default hover effect if no animation is configured
    return "&:hover { transform: scale(1.05); }";
  }}
`;

const Gallery: React.FC<GalleryProps> = ({
  sections,
  isMobile,
  componentName,
}) => {
  const sectionData = sections.find(
    (section) => section.type === componentName
  );

  if (!sectionData) return null;

  const { title, description, images } = sectionData.blocks;

  return (
    <Section $data={sectionData} $isMobile={isMobile}>
      {title && (
        <Title $data={sectionData} $isMobile={isMobile}>
          {title}
        </Title>
      )}
      {description && (
        <Description $data={sectionData} $isMobile={isMobile}>
          {description}
        </Description>
      )}
      <ImageGrid $data={sectionData} $isMobile={isMobile}>
        {images.map((image, index) => (
          <ImageWrapper key={index} $data={sectionData} $isMobile={isMobile}>
            <Link href={image.imageLink || "#"}>
              <Image
                src={image.imageSrc}
                alt={image.imageAlt}
                width={3000}
                height={3000}
                className="w-full h-full object-cover"
              />
            </Link>
          </ImageWrapper>
        ))}
      </ImageGrid>
    </Section>
  );
};

export default Gallery;
