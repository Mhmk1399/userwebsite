"use client";
import styled from "styled-components";
import { ContactFormDataSection } from "@/lib/types";

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

const Button = styled.button<{
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
`;

// ContactForm Component
const ContactForm: React.FC<ContactFormProps> = ({ sections, isMobile, componentName }) => {
  const sectionData = sections.find(
    (section) => section.type === componentName
  );
  if (!sectionData) {
    return <div>No data available</div>;
  }
  return (
    <Section dir="rtl" $data={sectionData} $isMobile={isMobile}>
      <Heading $data={sectionData}>
        {sectionData?.blocks?.heading || "Contact Us"}
      </Heading>
      <Form $isMobile={isMobile}>
        <Input $isMobile={isMobile} type="text" placeholder="نام" required />
        <Input $isMobile={isMobile} type="email" placeholder="ایمیل" required />
        <TextArea
          $isMobile={isMobile}
          placeholder="متن پیام شما ..."
          required
        />
        <Button $data={sectionData} $isMobile={isMobile} type="submit">
          ارسال
        </Button>
      </Form>
    </Section>
  );
};

export default ContactForm;
