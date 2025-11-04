"use client";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { FooterSection } from "@/lib/types";
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { useUserInfo } from "@/hook/useUserInfo";

interface FooterProps {
  footerData?: FooterSection;
}
interface Category {
  _id: string;
  name: string;
  children: CategoryChild[];
  storeId: string;
  slug: string;
}
interface CategoryChild {
  _id: string;
  name: string;
}

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
  position: relative;
  gap: 16px;
  text-align: center;
  border-radius: ${(props) => props.$data?.blocks?.setting?.bgRadius || "0"}px;
  box-shadow: ${(props) =>
    `${props.$data.blocks.setting?.shadowOffsetX || 0}px 
     ${props.$data.blocks.setting?.shadowOffsetY || 4}px 
     ${props.$data.blocks.setting?.shadowBlur || 10}px 
     ${props.$data.blocks.setting?.shadowSpread || 0}px 
     ${props.$data.blocks.setting?.shadowColor || "#fff"}`};
`;

const FooterText = styled.h2<{
  $data: FooterSection;
}>`
  font-size: ${(props) => props.$data?.blocks?.setting?.textFontSize || "14"}px;
  color: ${(props) => props.$data?.blocks?.setting?.textColor || "#ffffff"};
  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.textFontWeight || "normal"};
  color: ${(props) => props.$data?.blocks?.setting?.textColor || "#ffffff"};
  padding: 10px 5px;
`;

const FooterDescription = styled.p<{
  $data: FooterSection;
}>`
  font-size: ${(props) =>
    props.$data?.blocks?.setting?.descriptionFontSize || "normal"}
  font-weight: ${(props) =>
    props.$data?.blocks?.setting?.descriptionFontWeight || "normal"};
  color: ${(props) =>
    props.$data?.blocks?.setting?.descriptionColor || "#ffffff"};
  padding: 0 50px;
  line-height: 1.5;
  max-width: 800px;

`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  transition: all 0.3s ease-in-out;
`;
const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px
  padding: 0;
`;
const NumberPart = styled.div<{
  $data: FooterSection;
}>`
  color: ${(props) => props.$data?.blocks?.setting?.textColor || "#ffffff"};
  background: #ffffff;
  transition: border-color 0.2s ease;
  border-radius: 6px;
  padding: 10px;

  &:hover {
    border-color: #d1d5db;
  }

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      color: #3b82f6;
    }
  }
`;

const ScrollTopButton = styled.button<{
  $data: FooterSection;
}>`
  position: absolute;
  top: 16px;
  left: 16px;
  width: full;
  height: 36px;
  background: ${(props) =>
    props.$data?.blocks?.setting?.scrollButtonBg || "transparent"};
  color: ${(props) =>
    props.$data?.blocks?.setting?.scrollButtonColor || "#000"};
  border: 1px solid black;
  cursor: pointer;
  display: flex;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  padding: 0 10px;
  z-index: 10;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const FooterLink = styled(Link)<{ $data: FooterSection }>`
  font-weight: bold;
  text-decoration: none;
  color: ${(props) => props.$data?.blocks?.setting?.linkColor || "#ffffff"};
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 14px;
  &:hover {
    opacity: 0.7;
  }
`;

const Logo = styled(Image)<{
  $data: FooterSection;
}>`
  transition: transform 0.2s ease;
  border-radius: 8px;
  &:hover {
    transform: scale(1.02);
  }
`;
const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const ParentCategoryLink = styled(Link)<{
  $data: FooterSection;
}>`
  color: ${(props) => props.$data?.blocks?.setting?.categoryColor || "#000000"};
  font-weight: 600;
  font-size: 14px;
  padding: 8px 12px;
  text-align: center;
  border-radius: 6px;
  transition: all 0.2s ease;
  background-color: ${(props) =>
    props.$data?.blocks?.setting?.categoryBg || "#fff"};
  border: 1px solid #e9ecef;

  &:hover {
    opacity: 0.7;
    transform: translateX(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ChildCategoryLink = styled(Link)<{
  $data: FooterSection;
}>`
  color: ${(props) => props.$data?.blocks?.setting?.categoryColor || "#666666"};
  font-weight: 400;
  font-size: 12px;
  padding: 4px 8px;
  text-align: right;
  transition: all 0.2s ease;
  border-radius: 4px;
  display: block;
  text-decoration: none;
  &:hover {
    opacity: 0.8;
    transform: translateX(2px);
  }
`;
const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const ParentContainer = styled.div`
  width: 100%;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 8px;
`;

const ChildrenContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  align-items: center;
`;

const SocialLinkItem = styled(Link)`
  transition: transform 0.2s ease;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px) scale(1.05);
  }
`;

const Footer: React.FC<FooterProps> = ({ footerData }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [enamadExists] = useState(false);
  const [enamad] = useState("");
  const { basic, userInfo } = useUserInfo();

  const sectionData = footerData as FooterSection;

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    setHasMounted(true);

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");

        if (!response.ok) {
          console.log(`HTTP error! status: ${response.status}`);
        }

        const cateData = await response.json();
        setCategories(cateData);
      } catch (error) {
        console.log("Error fetching categories:", error);
        setCategories([
          {
            _id: "1",
            name: "لپ تاپ",
            children: [],
            storeId: "",
            slug: "laptops",
          },
          {
            _id: "2",
            name: "موبایل",
            children: [],
            storeId: "",
            slug: "phones",
          },
          {
            _id: "3",
            name: "تبلت",
            children: [],
            storeId: "",
            slug: "tablets",
          },
          {
            _id: "4",
            name: "ساعت هوشمند",
            children: [],
            storeId: "",
            slug: "smartwatches",
          },
          {
            _id: "5",
            name: "هدفون",
            children: [],
            storeId: "",
            slug: "headphones",
          },
          {
            _id: "6",
            name: "لوازم جانبی",
            children: [],
            storeId: "",
            slug: "accessories",
          },
        ]);
      }
    };

    fetchCategories();
  }, []);

  if (!hasMounted) {
    return null;
  }

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
    phoneNumber,
    textNumber,
  } = sectionData?.blocks;

  return (
    <FooterContainer dir="rtl" $data={sectionData}>
      <Link href="/" className="">
        <Logo
          $data={sectionData}
          src={basic?.logo || logo || "/assets/images/logo.webp"}
          width={70}
          height={70}
          alt="Logo"
        />
      </Link>
      <NumberPart $data={sectionData} className="">
        <Link
          href={`tel:${userInfo?.contact?.phone || phoneNumber || "123123123"}`}
        >
          {userInfo?.contact?.phone || phoneNumber} |{" "}
        </Link>
        <span className="text-sm text-gray-500 mr-1">
          {textNumber || "با این شماره تماس بگیرید"}
        </span>
      </NumberPart>

      <ScrollTopButton
        className="shadow-lg shadow-gray-500/50"
        $data={sectionData}
        onClick={(e) => {
          e.stopPropagation();
          scrollToTop();
        }}
      >
        <FaArrowUp className="ml-2" size={15} />
        <span> بازگشت به بالا </span>
      </ScrollTopButton>

      <FooterText $data={sectionData}>{text || "سربرگ"}</FooterText>

      <FooterDescription $data={sectionData}>
        {description || "توضیحات"}
      </FooterDescription>

      <SocialLinks className="flex flex-row gap-4 my-4">
        <SocialLinkItem
          href={instagramLink ? instagramLink : "/"}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-105 transition-all duration-300 ease-in-out"
        >
          <Image
            src="/assets/images/instagram.png"
            alt="Instagram"
            width={30}
            height={30}
          />
        </SocialLinkItem>
        <SocialLinkItem
          href={telegramLink ? telegramLink : "/"}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-105 transition-all duration-300 ease-in-out"
        >
          <Image
            src="/assets/images/whatsapp.png"
            alt="Whatsapp"
            width={30}
            height={30}
          />
        </SocialLinkItem>
        <SocialLinkItem
          href={whatsappLink ? whatsappLink : "/"}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-105 transition-all duration-300 ease-in-out"
        >
          <Image
            src="/assets/images/telegram.png"
            alt="Telegram"
            width={30}
            height={30}
          />
        </SocialLinkItem>
      </SocialLinks>
      {hasMounted && Array.isArray(categories) && (
        <CategoryGrid>
          {categories
            .filter(
              (category) => category.children && category.children.length > 0
            )
            .map((category) => (
              <CategorySection key={category._id}>
                <ParentContainer>
                  <ParentCategoryLink
                    href={`/store?categoryId=${category._id}`}
                    $data={sectionData}
                  >
                    {category.name}
                  </ParentCategoryLink>
                </ParentContainer>

                <ChildrenContainer>
                  {category.children.map((child) => (
                    <ChildCategoryLink
                      key={child._id}
                      href={`/store?categoryId=${child._id}`}
                      $data={sectionData}
                    >
                      {child.name}
                    </ChildCategoryLink>
                  ))}
                </ChildrenContainer>
              </CategorySection>
            ))}
        </CategoryGrid>
      )}

      {links && Array.isArray(links) && links.length > 0 && (
        <FooterLinks>
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
      {enamadExists && (
        <div>
          <Link href={enamad} target="_blank">
            <Image
              src="/assets/images/enamad.jpg"
              alt="Enamad Certification"
              width={100}
              height={50}
            />
          </Link>
        </div>
      )}
    </FooterContainer>
  );
};

export default Footer;
