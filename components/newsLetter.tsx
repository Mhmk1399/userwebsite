"use client";
import styled from "styled-components";
import { NewsLetterSection } from "@/lib/types";
import { useState } from "react";
import toast from "react-hot-toast";

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
    props.$data.blocks.setting.formBackground || "#f9f9f9"};
  border-radius: ${(props) => props.$data.blocks.setting.formRadius || "5"}px;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    `${props.$data.blocks.setting?.shadowOffsetX || 0}px 
     ${props.$data.blocks.setting?.shadowOffsetY || 4}px 
     ${props.$data.blocks.setting?.shadowBlur || 10}px 
     ${props.$data.blocks.setting?.shadowSpread || 0}px 
     ${props.$data.blocks.setting?.shadowColor || "#fff"}`};
`;

const Heading = styled.h2<{ $data: NewsLetterSection; $isMobile: boolean }>`
  color: ${(props) => props.$data.blocks.setting.headingColor};
  font-size: ${(props) => props.$data.blocks.setting.headingFontSize}px;
  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.headingFontWeight || "bold"};
  text-align: center;
`;

const Description = styled.p<{ $data: NewsLetterSection; $isMobile: boolean }>`
  color: ${(props) => props.$data.blocks.setting.descriptionColor};
  font-size: ${(props) => props.$data.blocks.setting.descriptionFontSize}px;
  font-weight: ${(props) => props.$data.blocks.setting.descriptionFontWeight};
  text-align: center;
`;

const Form = styled.form<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  width: 100%;
  padding: 10px;
`;

const Input = styled.input<{ $isMobile: boolean; $data: NewsLetterSection }>`
  padding: 10px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  background-color: ${(props) =>
    props.$data.blocks.setting.inputBackgroundColor};
  color: ${(props) => props.$data.blocks.setting.inputTextColor};
  border-radius: ${(props) => props.$data.blocks.setting.inputRadius || "5"}px;
  font-size: ${(props) => (props.$isMobile ? "14px" : "16px")};
  max-width: 100%;
  width: ${(props) => props.$data.blocks.setting.inputWidth || "300"}px;
`;

const Button = styled.button<{ $data: NewsLetterSection; $isMobile: boolean }>`
  padding: 10px 30px;
  background-color: ${(props) => props.$data.blocks.setting.btnBackgroundColor};
  color: ${(props) => props.$data.blocks.setting.btnTextColor};
  border: none;
  margin-top: 4px;
  border-radius: ${(props) => props.$data.blocks.setting.btnRadius || "5"}px;
  font-weight: 500;
  cursor: pointer;
  max-width: 100%;
  width: ${(props) => props.$data.blocks.setting.btnWidth || "5"}px;
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
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const sectionData = sections.find(
    (section) => section.type === componentName
  );
  if (!sectionData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("لطفاً شماره تلفن را وارد کنید");
      return;
    }

    if (!/^09\d{9}$/.test(phone)) {
      toast.error("شماره تلفن نامعتبر است");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phone,
        }),
      });

      if (response.ok) {
        toast.success("با موفقیت در خبرنامه عضو شدید");
        setPhone("");
      } else {
        toast.error("خطا در ثبت نام");
      }
    } catch (error) {
      console.log(error);
      toast.error("خطا در ارسال درخواست");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section dir="rtl" $data={sectionData} $isMobile={isMobile}>
      <Heading dir="rtl" $data={sectionData} $isMobile={isMobile}>
        {sectionData.blocks.heading || "خبرنامه ما"}
      </Heading>

      <Description dir="rtl" $data={sectionData} $isMobile={isMobile}>
        {sectionData.blocks.description ||
          "برای دریافت آخرین اخبار ایمیل خود را وارد کنید"}
      </Description>

      <Form $isMobile={isMobile} onSubmit={handleSubmit}>
        <Input
          dir="rtl"
          className="text-center"
          $isMobile={isMobile}
          $data={sectionData}
          type="tel"
          placeholder="09120000000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Button
          $data={sectionData}
          $isMobile={isMobile}
          type="submit"
          disabled={loading}
        >
          {loading ? "در حال ارسال..." : sectionData.blocks.btnText || "عضویت"}
        </Button>
      </Form>
    </Section>
  );
};

export default NewsLetter;
