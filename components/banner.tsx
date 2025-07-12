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

    
  /* Apply animations using CSS filters and properties that don't affect positioning */
  ${(props) => {
    const animation = props.$data.blocks.setting.animation;
    if (!animation) return "";

    const { type, animation: animConfig } = animation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: bannerPulse ${animConfig.duration} ${animConfig.timing} ${
        animConfig.delay || "0s"
      } ${animConfig.iterationCount || "1"};
        }
        
        @keyframes bannerPulse {
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
          animation: bannerGlow ${animConfig.duration} ${animConfig.timing} ${
        animConfig.delay || "0s"
      } ${animConfig.iterationCount || "1"};
        }
        
                @keyframes bannerGlow {
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
          animation: bannerBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes bannerBrightness {
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
          animation: bannerBlur ${animConfig.duration} ${animConfig.timing} ${
        animConfig.delay || "0s"
      } ${animConfig.iterationCount || "1"};
        }
        
        @keyframes bannerBlur {
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
          animation: bannerSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes bannerSaturate {
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
          animation: bannerContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes bannerContrast {
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
          animation: bannerOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes bannerOpacity {
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
          animation: bannerShadow ${animConfig.duration} ${animConfig.timing} ${
        animConfig.delay || "0s"
      } ${animConfig.iterationCount || "1"};
        }
        
        @keyframes bannerShadow {
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

const Banner: React.FC<props> = ({ sections, isMobile, componentName }) => {
  const sectionData = sections.find(
    (section) => section.type === componentName
  );
  if (!sectionData) {
    return <div>
       داده‌ای برای این بخش وجود ندارد.
    </div>;
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
