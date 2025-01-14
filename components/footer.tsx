"use client";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { FooterSection } from "@/lib/types";
import data from "@/public/template/homelg.json";
import { useEffect, useState } from "react";


const FooterContainer = styled.footer<{
  $data: FooterSection;
}>`
  padding-top: ${(props) => props.$data?.setting?.paddingTop || "20"}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom || "20"}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft || "0"}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight || "0"}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop || "0"}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || "0"}px;
  background-color: ${(props) => props.$data?.setting?.backgroundColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  width: 100%;
`;

const FooterText = styled.h2<{
  $data: FooterSection;
}>`
  font-size: ${(props) => props.$data?.blocks?.setting?.textFontSize || "16"};

  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.textFontWeight || "normal"};
  color: ${(props) => props.$data?.blocks?.setting?.textColor || "#ffffff"};
  padding: 10px 5px;
`;

const FooterDescription = styled.p<{
  $data: FooterSection;
}>`
  font-size: ${(props) =>
    props.$data?.blocks?.setting?.descriptionFontSize || "16"};

  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.descriptionFontWeight || "normal"};
  color: ${(props) =>
    props.$data?.blocks?.setting?.descriptionColor || "#ffffff"};
  padding: 0 50px;
`;

const SocialLinks = styled.div<object>`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 10px 0;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.08);
  }
`;
const FooterLinks = styled.div<object>`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
  padding: 0;
`;

const FooterLink = styled(Link)<{ $data: FooterSection }>`
  font-weight: bold;
  text-decoration: none;
  color: ${(props) => props.$data?.blocks?.setting?.linkColor || "#ffffff"};
  &:hover {
    opacity: 0.7;
  }
`;

const Logo = styled(Image)<{
  $data: FooterSection;
}>`
  width: ${(props) => props.$data?.blocks?.setting?.logoWidth || "100"};

  height: ${(props) => props.$data?.blocks?.setting?.logoHeight || "100"};

  border-radius: ${(props) =>
    props.$data?.blocks?.setting?.logoRadius || "6"}px;
`;

const Footer = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const sectionData = data.sections.sectionFooter as FooterSection;

  if (!mounted || !sectionData) {
    return null;
  }

  const {
    text,
    links,
    description,
    instagramLink,
    telegramLink,
    whatsappLink,
    logo,
  } = sectionData?.blocks;

  return (
    <FooterContainer dir="rtl" $data={sectionData}>
      <Logo
        $data={sectionData}
        src={logo || "/assets/images/logo.webp"}
        width={100}
        height={100}
        alt="Logo"
      />

      <FooterText $data={sectionData}>{text}</FooterText>

      <FooterDescription $data={sectionData}>{description}</FooterDescription>

      <SocialLinks>
        <Link
          href={instagramLink ? instagramLink : "/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/assets/images/instagram.png"
            alt="Instagram"
            width={30}
            height={30}
          />
        </Link>
        <Link
          href={telegramLink ? telegramLink : "/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/assets/images/whatsapp.png"
            alt="Whatsapp"
            width={30}
            height={30}
          />
        </Link>
        <Link
          href={whatsappLink ? whatsappLink : "/"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/assets/images/telegram.png"
            alt="Telegram"
            width={30}
            height={30}
          />
        </Link>
      </SocialLinks>

      {links && Array.isArray(links) && links.length > 0 && (
        <FooterLinks>
          {links.map((link, index) => (
            <FooterLink
              key={index}
              href={link.url}
              $data={sectionData}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </FooterLink>
          ))}
        </FooterLinks>
      )}
    </FooterContainer>
  );
};

export default Footer;
