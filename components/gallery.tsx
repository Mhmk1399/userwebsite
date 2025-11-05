"use client";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { GallerySection } from "@/lib/types";
import defaultImage from "@/public/assets/images/defaultimage.jpg"

const getImageSrc = (imageSrc: string) => {
  return imageSrc?.includes('https') ? imageSrc : defaultImage.src;
};
interface GalleryProps {
  sections: GallerySection[];
  isMobile: boolean;
  componentName: string;
}

const Section = styled.section<{
  $data: GallerySection;
  $isMobile: boolean;
}>`
  max-width: 100%;
  margin-top: ${(props) => props.$data.setting.marginTop || "30"}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom}px;
  margin-right: ${(props) => props.$data.setting.marginRight}px;
  margin-left: ${(props) => props.$data.setting.marginLeft}px;
  padding-top: ${(props) => props.$data.setting.paddingTop}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom}px;
  padding-left: ${(props) => props.$data.setting.paddingLeft}px;
  padding-right: ${(props) => props.$data.setting.paddingRight}px;
  background-color: ${(props) =>
    props.$data?.blocks?.setting?.background || "#ffffff"};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: ${(props) => props.$data.blocks?.setting?.Radius || "5"}px;
  box-shadow: ${(props) =>
    `${props.$data.blocks.setting?.shadowOffsetX || 0}px 
     ${props.$data.blocks.setting?.shadowOffsetY || 4}px 
     ${props.$data.blocks.setting?.shadowBlur || 10}px 
     ${props.$data.blocks.setting?.shadowSpread || 0}px 
     ${props.$data.blocks.setting?.shadowColor || "#fff"}`};
`;

const Title = styled.h2<{
  $data: GallerySection;
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data.blocks.setting?.titleColor || "#000000"};
  font-size: ${(props) => props.$data.blocks.setting?.titleFontSize || "24"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting?.titleFontWeight || "bold"};
`;

const Description = styled.p<{
  $data: GallerySection;
  $isMobile: boolean;
}>`
  color: ${(props) =>
    props.$data.blocks.setting?.descriptionColor || "#666666"};
  font-size: ${(props) =>
    props.$data.blocks.setting?.descriptionFontSize || "16"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting?.descriptionFontWeight || "normal"};
  margin-bottom: 30px;
  padding: 0px 20px;
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
`;

const ImageWrapper = styled.div<{
  $data: GallerySection;
  $isMobile: boolean;
}>`
  position: relative;
  height: ${(props) => props.$data.blocks.setting?.imageHeight || "200"}px;
  width: ${(props) => props.$data.blocks.setting?.imageWidth || "200"}px;
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
      <Title dir="rtl" $data={sectionData} $isMobile={isMobile}>
        {title}
      </Title>

      <Description dir="rtl" $data={sectionData} $isMobile={isMobile}>
        {description}
      </Description>

      <ImageGrid $data={sectionData} $isMobile={isMobile}>
        {images.map((image, index) => (
          <ImageWrapper key={index} $data={sectionData} $isMobile={isMobile}>
            <Link href={image.imageLink || "#"}>
              <Image
                src={getImageSrc(image.imageSrc)}
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
