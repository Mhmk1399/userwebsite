"use client";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { FooterSection } from "@/lib/types";
import data from "@/public/template/homelg.json";
import { useEffect, useState } from "react";
import { BiTimer } from "react-icons/bi";
import {
  FaTruck,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaCertificate,
  FaArrowUp,
} from "react-icons/fa";
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

const trustItems = [
  {
    icon: FaTruck,
    text: "امکان تحویل اکسپرس",
  },
  {
    icon: FaMoneyBillWave,
    text: " پرداخت در محل",
  },
  {
    icon: BiTimer,
    text: "۷ روز هفته ۲۴ ساعته",
  },
  {
    icon: FaExchangeAlt,
    text: "7 روز ضمانت بازگشت کالا",
  },
  {
    icon: FaCertificate,
    text: "ضمانت اصل بودن کالا",
  },
];

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
  gap: 10px;
  text-align: center;
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
  padding: 0 50px
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
`;

const SvgBox = styled.div<{
  $data: FooterSection;
}>`
  width: ${(props) => props.$data?.blocks?.setting?.logoWidth || "30"}px;
  height: ${(props) => props.$data?.blocks?.setting?.logoHeight || "30"}px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.08);
  }
`;
const TrustIconsContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 2rem 0;
  flex-wrap: nowrap;
  gap: 20px;
  justify-content: center;
  @media (min-width: 768px) {
    justify-content: space-around;
    align-items: center;
  }
`;

const TrustItem = styled.div<{
  $data: FooterSection;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  width: 52px;
`;

const IconBox = styled(SvgBox)`
  background: ${(props) =>
    props.$data?.blocks?.setting?.trustIconBackground || "#f8f9fa"};
  color: ${(props) => props.$data?.blocks?.setting?.trustIconColor || "red"};
  padding: 4px;
`;

const TrustText = styled.span<{
  $data: FooterSection;
}>`
  font-size: ${(props) =>
    props.$data?.blocks?.setting?.trustItemSize || "14"}px;
  color: ${(props) => props.$data?.blocks?.setting?.trustItemColor || "#333"};
  font-weight: 500;
`;
const ScrollTopButton = styled.button<{
  $data: FooterSection;
}>`
  position: absolute;
  top: 50px;
  left: 20px;
  width: full;
  height: 40px;
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
  &:hover {
    opacity: 0.7;
  }
`;

const Logo = styled(Image)<{
  $data: FooterSection;
}>`
  width: ${(props) => props.$data?.blocks?.setting?.logoWidth || "30"}px;
  height: ${(props) => props.$data?.blocks?.setting?.logoHeight || "30"}px;
  border-radius: ${(props) =>
    props.$data?.blocks?.setting?.logoRadius || "6"}px;
`;
const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1200px;
  padding: 20px
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
  font-weight: 700;
  font-size: 16px;
  padding: 8px;
  text-align: center;
  border-radius: 6px;
  transition: all 0.3s ease;
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
  font-weight: 500;
  font-size: 14px;
  padding: 4px 12px;
  text-align: right;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
    transform: translateX(2px);
  }
`;

const Footer = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [enamadExists] = useState(false);
  const [enamad] = useState({});
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
        const token = localStorage.getItem("sectionToken");
        console.log("Footer token:", token);

        const response = await fetch("/api/category", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cateData = await response.json();
        setCategories(cateData);
      } catch (error) {
        console.log("Error fetching categories", error);
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
    return null; // Or a loading skeleton
  }

  const sectionData = data.sections.sectionFooter as unknown as FooterSection;

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
      <Link href="/" className="ml-auto">
        <Logo
          $data={sectionData}
          src={logo || "/assets/images/logo.webp"}
          width={100}
          height={100}
          alt="Logo"
          className="ml-auto mr-6"
        />
      </Link>
      <NumberPart $data={sectionData} className="ml-auto  mt-4 mr-6">
        <Link href={`tel:${phoneNumber || "123123123"}`}>{phoneNumber} | </Link>
        <span className="text-sm text-gray-500 mr-1">{textNumber}</span>
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

      <FooterText $data={sectionData}>{text || "Footer Text"}</FooterText>

      <FooterDescription $data={sectionData}>{description}</FooterDescription>
      <TrustIconsContainer className="w-full flex justify-center">
        {trustItems.map((item, index) => (
          <TrustItem key={index} $data={sectionData}>
            <IconBox $data={sectionData}>
              <item.icon size={25} />
            </IconBox>
            <TrustText $data={sectionData}>{item.text}</TrustText>
          </TrustItem>
        ))}
      </TrustIconsContainer>

      <div className="flex flex-col-reverse gap-6 lg:flex-col-reverse items-center justify-center w-[98%] ">
        <SocialLinks className="flex flex-row gap-4 my-4">
          <Link
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
          </Link>
          <Link
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
          </Link>
          <Link
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
          </Link>
        </SocialLinks>
        {hasMounted && Array.isArray(categories) && (
          <CategoryGrid>
            {categories
              .filter(
                (category) => category.children && category.children.length > 0
              )
              .map((category) => (
                <div key={category._id} className="flex flex-col gap-3">
                  <ParentCategoryLink
                    href={`/store?categoryId=${category._id}`}
                    $data={sectionData}
                  >
                    {category.name}
                  </ParentCategoryLink>

                  <div className="flex flex-col gap-2 pr-4 border-r-2 border-gray-200">
                    {category.children.map((child) => (
                      <ChildCategoryLink
                        key={child._id}
                        href={`/store?categoryId=${child._id}`}
                        $data={sectionData}
                      >
                        {child.name}
                      </ChildCategoryLink>
                    ))}
                  </div>
                </div>
              ))}
          </CategoryGrid>
        )}
      </div>

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
