"use client";
import {
  HeaderSection,
  Section as SectionType,
  HeaderBlock,
} from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Search, ShoppingCart, User, MapPin } from "lucide-react";
import data from "@/public/template/homelg.json";



interface Category {
  _id: string;
  name: string;
  children: string[];
  storeId: string;
}

// Styled components
const HeaderWrapper = styled.header<{
  $data: HeaderSection;
}>`
  width: 100%;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
  margin-top: ${(props) => props.$data.setting?.marginTop || "0"}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom}px;
  padding-top: ${(props) => props.$data?.setting?.paddingTop}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight};
  background-color: ${(props) =>
    props.$data?.blocks?.setting?.bgColor || "#000"};
`;

const AnnouncementBar = styled.div<{
  $data: HeaderSection;
}>`
  width: 100%;
  background-color: ${(props) =>
    props.$data.blocks?.setting?.announcementBgColor || "#f1b80c"};
  color: ${(props) =>
    props.$data.blocks?.setting?.announcementTextColor || "#ffffff"};
  padding: 17px 16px;
  text-align: center;
  font-size: ${(props) =>
    props.$data.blocks.setting?.announcementFontSize || "14"}px;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 12px;
  }
`;

const MainSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row-reverse;
  padding: 0.5rem 1.5rem;

  @media (max-width: 768px) {
    padding: 0.75rem;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
  @media (max-width: 768px) {
    width: fit-content;
  }
`;

const Logo = styled.img<{
  $data: HeaderSection;
}>`
  width: ${(props) => props.$data.blocks.setting?.imageWidth || "60"}px;
  height: ${(props) => props.$data.blocks.setting?.imageHeight || "60"}px;
  border-radius: ${(props) =>
    props.$data.blocks.setting?.imageRadius || "30"}px;
  margin-left: auto;
`;

const SearchContainer = styled.div`
  position: relative;
  // flex: 1;
  @media (min-width: 768px) {
    margin-right: 1rem;
    // margin-left: 500px;
  }
`;

const SearchInput = styled.input`
  width: 500px;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  text-align: right;
  background-color: #f3f4f6;

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.5rem 1rem;
  }

  &:focus {
    outline: none;
    ring: 1px solid #000;
  }
`;

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1.5rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavList = styled.ul<{
  $data: HeaderSection;
}>`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  gap: ${(props) => props.$data.blocks.setting?.gap || "1"}px;
`;

const NavItem = styled(Link)<{
  $data: HeaderSection;
}>`
  color: ${(props) => props.$data.blocks.setting?.itemColor || "#000"};
  font-size: ${(props) => props.$data.blocks.setting?.itemFontSize || "14"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting?.itemFontWeight || "normal"};
  cursor: pointer;
  text-align: right;

  &:hover {
    color: ${(props) =>
      props.$data.blocks.setting?.itemHoverColor || "#FCA311"};
  }
`;
const MegaMenu = styled.div<{ isVisible?: boolean; $data: HeaderSection }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 800px;
  background-color: ${(props) =>
    props.$data.blocks?.setting?.megaMenuBg || "#f1b80c"};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 50;
  display: flex;
  border-radius: 8px;
  padding: 1rem;
  direction: rtl;
`;

const NavItemWrapper = styled.li<{ $data?: HeaderSection }>`
  position: relative;
  &:hover ${MegaMenu} {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;
const CategoryItem = styled.span<{ $data: HeaderSection }>`
  color: ${(props) =>
    props.$data.blocks.setting?.categoryItemColor || "#374151"};
  font-size: ${(props) =>
    props.$data.blocks.setting?.categoryItemSize || "14"}px;
  transition: all 0.2s ease;

  &:hover {
    color: ${(props) =>
      props.$data.blocks.setting?.categoryItemHoverColor || "#2563eb"};
  }
`;

const MegaMenuTitle = styled.h3`
  font-size: 0.95rem;
  color: #374151;
  text-wrap: nowrap;
  text-align: right;
  transition: all 0.2s ease;
`;

const CategoryIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  width: 100%;
  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border: 1px solid #e4e4e4;
  border-radius: 0.5rem;
  color: #6c757d;
  text-wrap: nowrap;
`;

const LocationButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background-color: #fff7ed;
  color: #ea580c;
  border-radius: 0.5rem;
`;
const MobileMenuButton = styled.button<{
  $isOpen: boolean;
}>`
  display: none;
  background: none;
  border: none;
  padding: 10px;
  z-index: 100;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div<{
  $isOpen: boolean;
}>`
  display: ${(props) =>
   props.$isOpen ? "inline" : "none"};
  position: ${(props) =>
    props.$isOpen ? "absolute" : "none"};
  top: ${(props) =>
    props.$isOpen ? "0" : "-100%"};
  right: ${(props) =>
     props.$isOpen ? "0" : "-100%"};
  width: ${(props) =>
     props.$isOpen ? "80%" : "0"};
  height: ${(props) =>
     props.$isOpen ? "100vh" : "0"};
  transition: right 0.3s ease-in-out;
  @media (max-width: 768px) {
    display: inline;
    position: fixed;
    top: 0;
    right: ${(props) => (props.$isOpen ? "0" : "-100%")};
    width: 80%;
    height: 100vh;
    background: white;
    transition: right 0.3s ease-in-out;
    box-shadow: ${(props) =>
      props.$isOpen ? "-5px 0 15px rgba(0,0,0,0.1)" : "none"};
    z-index: 99;
  }
`;

const MobileNavList = styled.div`
  padding: 80px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MobileNavItem = styled(NavItem)`
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 16px;
  width: 100%;
  display: block;
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  @media (max-width: 768px) {
    display: ${(props) => (props.$isOpen ? "block" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 98;
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoverd, setHoverd] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);

  

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = !isMenuOpen ? "hidden" : "unset";
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        const data = await response.json();

        setCategories(data);
      } catch (error) {
        console.log("Error fetching categories", error);

        // Default categories if fetch fails
        setCategories([
          {
            _id: "1",
            name: "لپ تاپ",
            children: [],
            storeId: "",
          },
          {
            _id: "2",
            name: "موبایل",
            children: [],
            storeId: "",
          },
          {
            _id: "3",
            name: "تبلت",
            children: [],
            storeId: "",
          },
          {
            _id: "4",
            name: "ساعت هوشمند",
            children: [],
            storeId: "",
          },
          {
            _id: "5",
            name: "هدفون",
            children: [],
            storeId: "",
          },
          {
            _id: "6",
            name: "لوازم جانبی",
            children: [],
            storeId: "",
          },
        ]);
      }
    };

    fetchCategories();
  }, []);

 


  const sectionData = data?.sections?.sectionHeader as HeaderSection;
  const isHeaderSection = (section: SectionType): section is HeaderSection => {
    return section?.type === "header" && "blocks" in section;
  };

  if (!sectionData || !isHeaderSection(sectionData)) {
    //  ("Section data is missing or invalid.");
    return null;
  }

  const { blocks } = sectionData;

  const isHeaderBlock = (block: HeaderBlock): block is HeaderBlock => {
    return (
      block &&
      "imageLogo" in block &&
      "imageAlt" in block &&
      Array.isArray(block.links)
    );
  };

  if (!isHeaderBlock(blocks)) {
    console.error("Blocks data is missing or invalid.");
    return null;
  }

  return (
    <HeaderWrapper
      $data={sectionData}
     
    >
    
      <AnnouncementBar $data={sectionData}>
        {sectionData.blocks.setting?.announcementText ||
          "ارسال رایگان برای خرید‌های بالای ۵۰۰ هزار تومان!"}
      </AnnouncementBar>

      <MainSection>
        <div className="flex flex-row-reverse items-center gap-6 justify-end w-full">
          <LogoContainer>
            <Logo
              $data={sectionData}
              src={sectionData.blocks.imageLogo || "/assets/images/logo.webp"}
              alt={sectionData.blocks.imageAlt}
            />
          </LogoContainer>

          <SearchContainer>
            <SearchInput placeholder="جستجو" />
            <Search
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6b7280",
              }}
              size={20}
            />
          </SearchContainer>
        </div>

        <ActionButtons>
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-gray-400" size={24} />
            <LoginButton>
              <User size={18} /> ورود | ثبت‌نام
            </LoginButton>
          </div>

          <MobileMenuButton
            $isOpen={isMenuOpen}
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`${isMenuOpen ? "opacity-0" : "block"}`}
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </MobileMenuButton>
        </ActionButtons>
      </MainSection>

      <NavContainer>
        <LocationButton>
          <MapPin size={16} /> شهر خود را انتخاب کنید
        </LocationButton>
        <NavList $data={sectionData}>
          {sectionData.blocks.links?.map((link, index) => (
            <NavItemWrapper key={index}>
              {link.name === "دسته‌بندی کالاها" ? (
                <>
                  <NavItem href="" $data={sectionData}>
                    <CategoryIconWrapper>
                      {link.name}
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </CategoryIconWrapper>
                  </NavItem>
                  <MegaMenu $data={sectionData}>
                    <div className="flex flex-col w-1/4 border-l border-gray-200">
                      {categories
                        .filter((category) => category.children.length > 0)
                        .map((category, idx) => (
                          <Link
                            href={`/category`}
                            key={category._id}
                            className="block"
                          >
                            <div
                              className={`py-3 px-4 rounded-md ml-4 cursor-pointer transition-all duration-200 ${
                                idx === hoverd ? "bg-gray-100 font-bold" : ""
                              }`}
                              onMouseEnter={() => setHoverd(idx)}
                            >
                              <MegaMenuTitle>{category.name}</MegaMenuTitle>
                            </div>
                          </Link>
                        ))}
                    </div>
                    <div className="flex-1 p-4">
                      <div className="grid grid-cols-3 gap-4">
                        {categories
                          .filter((category) => category.children.length > 0)
                          [hoverd]?.children.map((childId) => {
                            const childCategory = categories.find(
                              (cat) => cat._id === childId
                            );
                            return (
                              childCategory && (
                                <Link
                                  href={`/category`}
                                  key={childCategory._id}
                                  className="p-1 hover:translate-x-[2px] rounded-md transition-all duration-200 text-right"
                                >
                                  <CategoryItem $data={sectionData}>
                                    {childCategory.name}
                                  </CategoryItem>
                                </Link>
                              )
                            );
                          })}
                      </div>
                    </div>
                  </MegaMenu>
                </>
              ) : (
                <NavItem href={link.url} $data={sectionData}>
                  {link.name}
                </NavItem>
              )}
            </NavItemWrapper>
          ))}
        </NavList>
      </NavContainer>

      <div>
        <MobileMenu
          className="z-[9999] transition-all duration-300 bg-white"
          $isOpen={isMenuOpen}
        >
          <MobileNavList>
            <LocationButton style={{ width: "100%", marginBottom: "20px" }}>
              <MapPin size={16} /> شهر خود را انتخاب کنید
            </LocationButton>
            {sectionData.blocks.links?.map((link, index) => (
              <MobileNavItem
                key={index}
                href={link.url}
                $data={sectionData}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </MobileNavItem>
            ))}
          </MobileNavList>
        </MobileMenu>
      </div>

      <Overlay $isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
    </HeaderWrapper>
  );
};

export default Header;
