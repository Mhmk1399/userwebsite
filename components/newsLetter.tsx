"use client";
import styled from "styled-components";
import { NewsLetterSection } from "@/lib/types";

interface NewsLetterProps {
  sections: NewsLetterSection[]; // Changed from { SlideShow: SlideSection[] }
  isMobile: boolean;
  componentName: string;
}

const Section = styled.section<{
  $data: NewsLetterSection;
  $isMobile: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: ${(props) => props.$data.setting.paddingTop || "20"}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom || "20"}px;
  padding-left: ${(props) => props.$data.setting.paddingLeft || "20"}px;
  padding-right: ${(props) => props.$data.setting.paddingRight || "20"}px;
  margin-top: ${(props) => props.$data.setting.marginTop || "20"}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom || "20"}px;
  background-color: ${(props) =>
    props.$data.blocks.setting.formBackground || "#f9f9f9"};
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  // width: ${(props) => (props.$isMobile ? "425px" : "100%")};
  transition: all 0.3s ease;
  margin-left: 10px;
  margin-right: 10px;
`;

const Heading = styled.h2<{ $data: NewsLetterSection; $isMobile: boolean }>`
  color: ${(props) => props.$data.blocks.setting.headingColor};
  font-size: ${(props) =>
    props.$isMobile
      ? `${parseInt(props.$data.blocks.setting.headingFontSize) * 0.8}px`
      : `${props.$data.blocks.setting.headingFontSize}px`};
  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.headingFontWeight || "bold"};
  text-align: center;
  padding: ${(props) => (props.$isMobile ? "10px" : "20px")};
`;

const Description = styled.p<{ $data: NewsLetterSection; $isMobile: boolean }>`
  color: ${(props) => props.$data.blocks.setting.descriptionColor};
  font-size: ${(props) =>
    props.$isMobile
      ? `${parseInt(props.$data.blocks.setting.descriptionFontSize) * 0.8}px`
      : `${props.$data.blocks.setting.descriptionFontSize}px`};
  font-weight: ${(props) => props.$data.blocks.setting.descriptionFontWeight};
  text-align: center;
  margin-bottom: ${(props) => (props.$isMobile ? "15px" : "20px")};
  padding: 0 ${(props) => (props.$isMobile ? "15px" : "20px")};
`;

const Form = styled.form<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${(props) => (props.$isMobile ? "90%" : "100%")};
  padding: 0 ${(props) => (props.$isMobile ? "15px" : "20px")};
`;

const Input = styled.input<{ $isMobile: boolean }>`
  padding: ${(props) => (props.$isMobile ? "6px" : "8px")};
  margin-bottom: ${(props) => (props.$isMobile ? "10px" : "15px")};
  border: 1px solid #ccc;
  border-radius: 15px;
  font-size: ${(props) => (props.$isMobile ? "14px" : "16px")};
  width: 100%;
  max-width: ${(props) => (props.$isMobile ? "300px" : "400px")};
`;

const Button = styled.button<{ $data: NewsLetterSection; $isMobile: boolean }>`
  padding: ${(props) => (props.$isMobile ? "8px 20px" : "10px 30px")};
  background-color: ${(props) => props.$data.blocks.setting.btnBackgroundColor};
  color: ${(props) => props.$data.blocks.setting.btnTextColor};
  border: none;
  margin-top: 4px;
  border-radius: 5px;
  font-size: ${(props) => (props.$isMobile ? "14px" : "16px")};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.4s ease-in-out;

  &:hover {
    opacity: 0.7;
  }
  /* Apply button animations */
  ${(props) => {
    const btnAnimation = props.$data.blocks?.setting?.btnAnimation;
    if (!btnAnimation) return "";

    const { type, animation: animConfig } = btnAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: newsletterBtnPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes newsletterBtnPulse {
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
          animation: newsletterBtnGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes newsletterBtnGlow {
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
          animation: newsletterBtnBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes newsletterBtnBrightness {
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
          animation: newsletterBtnBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes newsletterBtnBlur {
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
          animation: newsletterBtnSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes newsletterBtnSaturate {
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
          animation: newsletterBtnContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes newsletterBtnContrast {
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
          animation: newsletterBtnOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes newsletterBtnOpacity {
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
          animation: newsletterBtnShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes newsletterBtnShadow {
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

const NewsLetter: React.FC<NewsLetterProps> = ({
  sections,
  isMobile,
  componentName,
}) => {
  const sectionData = sections.find(
    (section) => section.type === componentName
  );
  if (!sectionData) return null;

  return (
    <Section dir="rtl" $data={sectionData} $isMobile={isMobile}>
      <Heading $data={sectionData} $isMobile={isMobile}>
        {sectionData.blocks.heading || "خبرنامه ما"}
      </Heading>

      <Description $data={sectionData} $isMobile={isMobile}>
        {sectionData.blocks.description ||
          "برای دریافت آخرین اخبار ایمیل خود را وارد کنید"}
      </Description>

      <Form $isMobile={isMobile}>
        <Input
          $isMobile={isMobile}
          type="email"
          placeholder="ایمیل خود را وارد کنید"
          required
        />
        <Button $data={sectionData} $isMobile={isMobile} type="submit">
          {sectionData.blocks.btnText || "عضویت"}
        </Button>
      </Form>
    </Section>
  );
};

export default NewsLetter;
