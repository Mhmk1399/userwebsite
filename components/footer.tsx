"use client";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { FooterSection } from "@/lib/types";

interface FooterProps {
  sections: {
    Footer: FooterSection[];
  };
  isMobile: boolean;
}

const FooterContainer = styled.footer<{
  $data: FooterSection;
  $isMobile: boolean;
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
  gap: ${(props) => (props.$isMobile ? "8px" : "10px")};
  text-align: center;
  // width: ${(props) => (props.$isMobile ? "425px" : "100%")};
`;

const FooterText = styled.h2<{
  $data: FooterSection;
  $isMobile: boolean;
}>`
  font-size: ${(props) => {
    const baseFontSize = props.$data?.blocks?.setting?.textFontSize || "16";
    return props.$isMobile
      ? `${parseInt(baseFontSize) * 0.8}px`
      : `${baseFontSize}px`;
  }};
  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.textFontWeight || "normal"};
  color: ${(props) => props.$data?.blocks?.setting?.textColor || "#ffffff"};
  padding: ${(props) => (props.$isMobile ? "8px 4px" : "10px 5px")};
`;

const FooterDescription = styled.p<{
  $data: FooterSection;
  $isMobile: boolean;
}>`
  font-size: ${(props) => {
    const baseFontSize =
      props.$data?.blocks?.setting?.descriptionFontSize || "16";
    return props.$isMobile
      ? `${parseInt(baseFontSize) * 0.8}px`
      : `${baseFontSize}px`;
  }};
  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.descriptionFontWeight || "normal"};
  color: ${(props) =>
    props.$data?.blocks?.setting?.descriptionColor || "#ffffff"};
  padding: ${(props) => (props.$isMobile ? "0 20px" : "0 50px")};
`;

const SocialLinks = styled.div<{
  $isMobile: boolean;
}>`
  display: flex;
  justify-content: center;
  gap: ${(props) => (props.$isMobile ? "10px" : "15px")};
  margin: ${(props) => (props.$isMobile ? "8px 0" : "10px 0")};
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.08);
  }
`;
const FooterLinks = styled.div<{
  $isMobile: boolean;
}>`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${(props) => (props.$isMobile ? "10px" : "15px")};
  margin-top: ${(props) => (props.$isMobile ? "8px" : "10px")};
  padding: ${(props) => (props.$isMobile ? "0 10px" : "0")};
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
  $isMobile: boolean;
}>`
  width: ${(props) => {
    const baseWidth = props.$data?.blocks?.setting?.logoWidth || "100";
    return props.$isMobile
      ? `${parseInt(baseWidth) * 0.8}px`
      : `${baseWidth}px`;
  }};
  height: ${(props) => {
    const baseHeight = props.$data?.blocks?.setting?.logoHeight || "100";
    return props.$isMobile
      ? `${parseInt(baseHeight) * 0.8}px`
      : `${baseHeight}px`;
  }};
  border-radius: ${(props) =>
    props.$data?.blocks?.setting?.logoRadius || "6"}px;
`;

const Footer: React.FC<FooterProps> = ({ sections: { Footer }, isMobile }) => {
  const sectionData = Footer?.[0];

  console.log(sectionData , "sec");


  if (!sectionData) {
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
    <FooterContainer $isMobile={isMobile} dir="rtl" $data={sectionData}>
      <Logo
        $isMobile={isMobile}
        $data={sectionData}
        src={logo || "/assets/images/logo.webp"}
        width={100}
        height={100}
        alt="Logo"
      />

      <FooterText $isMobile={isMobile} $data={sectionData}>
        {text}
      </FooterText>

      <FooterDescription $isMobile={isMobile} $data={sectionData}>
        {description}
      </FooterDescription>

      <SocialLinks $isMobile={isMobile}>
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
        <FooterLinks $isMobile={isMobile}>
          {links.map((link, index) => (
            <FooterLink
              key={index}
              href={link?.url || "#"}
              $data={sectionData}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link?.label || "Link"}
            </FooterLink>
          ))}
        </FooterLinks>
      )}
    </FooterContainer>
  );
};

export default Footer;
