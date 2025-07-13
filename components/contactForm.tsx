"use client";
import styled from "styled-components";
import { ContactFormDataSection } from "@/lib/types";
import { useState } from "react";
import toast from "react-hot-toast";

interface ContactFormProps {
  sections: ContactFormDataSection[];
  isMobile: boolean;
  componentName: string;
}

const Section = styled.section<{
  $data: ContactFormDataSection;
  $isMobile: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: ${(props) => props.$data?.setting?.paddingTop || "20"}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom || "20"}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft || "20"}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight || "20"}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop || "20"}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || "20"}px;
  background-color: ${(props) =>
    props.$data.blocks?.setting?.formBackground || "#f9f9f9"};
  border-radius: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: ${(props) => (props.$isMobile ? "100%" : "auto")};
  max-width: ${(props) => (props.$isMobile ? "425px" : "100%")};
`;

const Heading = styled.h2<{ $data: ContactFormDataSection }>`
  color: ${(props) => props.$data.blocks?.setting?.headingColor || "#333"};
  font-size: ${(props) =>
    props.$data.blocks?.setting?.headingFontSize || "24px"}px;
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.headingFontWeight || "bold"};
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Form = styled.form<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${(props) => (props.$isMobile ? "90%" : "100%")};
  max-width: ${(props) => (props.$isMobile ? "340px" : "800px")};
  padding: 0 ${(props) => (props.$isMobile ? "10px" : "20px")};
`;

const Input = styled.input<{ $isMobile: boolean }>`
  padding: ${(props) => (props.$isMobile ? "10px" : "14px")};
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: ${(props) => (props.$isMobile ? "14px" : "16px")};
  width: 70%;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const TextArea = styled.textarea<{ $isMobile: boolean }>`
  padding: ${(props) => (props.$isMobile ? "10px" : "14px")};
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: ${(props) => (props.$isMobile ? "14px" : "16px")};
  width: 70%;
  resize: vertical;
  min-height: ${(props) => (props.$isMobile ? "80px" : "100px")};

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
  }

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const SubmitButton = styled.button<{
  $data: ContactFormDataSection;
  $isMobile: boolean;
}>`
  padding: ${(props) => (props.$isMobile ? "12px 30px" : "15px 50px")};
  background-color: ${(props) =>
    props.$data.blocks.setting?.btnBackgroundColor || "#007bff"};
  color: ${(props) => props.$data.blocks.setting?.btnTextColor || "#fff"};
  border: none;
  border-radius: 5px;
  font-size: ${(props) => (props.$isMobile ? "14px" : "16px")};
  cursor: pointer;
  transition: all 0.4s ease-in-out;
  width: ${(props) => (props.$isMobile ? "50%" : "70%")};
  text-align: center;

  &:hover {
    background-color: ${(props) =>
      props.$data.blocks.setting?.btnBackgroundColor ? "#0056b3" : "#9c119c"};
    transform: scale(0.97);
  }

  /* Apply button animations */
  ${(props) => {
    const btnAnimation = props.$data?.blocks?.setting?.btnAnimation;
    if (!btnAnimation) return "";

    const { type, animation: animConfig } = btnAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: contactFormBtnPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes contactFormBtnPulse {
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
          animation: contactFormBtnGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes contactFormBtnGlow {
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
          animation: contactFormBtnBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes contactFormBtnBrightness {
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
          animation: contactFormBtnBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes contactFormBtnBlur {
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
          animation: contactFormBtnSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes contactFormBtnSaturate {
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
          animation: contactFormBtnContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes contactFormBtnContrast {
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
          animation: contactFormBtnOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes contactFormBtnOpacity {
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
          animation: contactFormBtnShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes contactFormBtnShadow {
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

// ContactForm Component
const ContactForm: React.FC<ContactFormProps> = ({
  sections,
  isMobile,
  componentName,
}) => {
  const sectionData = sections.find(
    (section) => section.type === componentName
  );
  if (!sectionData) return null;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("پیام شما با موفقیت ارسال شد");
      } else {
        toast.error("خطا در ارسال پیام");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Section dir="rtl" $data={sectionData} $isMobile={isMobile}>
      <Heading $data={sectionData}>
        {sectionData?.blocks?.heading || "Contact Us"}
      </Heading>
      <Form $isMobile={isMobile}>
        <Input
          $isMobile={isMobile}
          type="text"
          name="name"
          placeholder="نام"
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, name: e.target.value });
          }}
        />
        <Input
          $isMobile={isMobile}
          type="number"
          name="phone"
          placeholder="شماره تلفن"
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, phone: e.target.value });
          }}
        />

        <TextArea
          $isMobile={isMobile}
          placeholder="متن پیام شما ..."
          required
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setFormData({ ...formData, message: e.target.value });
          }}
        />
        <SubmitButton
          $data={sectionData}
          $isMobile={isMobile}
          onClick={handleSubmit}
        >
          ارسال
        </SubmitButton>
      </Form>
    </Section>
  );
};

export default ContactForm;
