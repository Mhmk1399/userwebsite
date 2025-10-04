"use client";
import {
  HeaderSection,
  Section as SectionType,
  HeaderBlock,
} from "@/lib/types";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  ShoppingCart,
  Menu,
  MenuIcon,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import UserMenu from "./userMenu";
import { useAuth } from "@/hook/useAuth";
import { useUserInfo } from "@/hook/useUserInfo";

interface HeaderProps {
  headerData?: HeaderSection;
  isMobile: boolean;
}

interface Category {
  _id: string;
  name: string;
  children: CategoryChild[];
  storeId: string;
}
interface CategoryChild {
  _id: string;
  name: string;
}

// Styled components
const HeaderWrapper = styled.header<{
  $data: HeaderSection;
  $isMobile: boolean;
  $isScrolled: boolean;
}>`
  width: 100%;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: ${(props) => {
    const hexColor = props.$data?.blocks?.setting?.bgColor || "#000";
    if (props.$isScrolled) {
      // Convert hex to RGB
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, 0.85)`;
    }
    return hexColor;
  }};
  backdrop-filter: ${(props) => (props.$isScrolled ? "blur(10px)" : "none")};
  -webkit-backdrop-filter: ${(props) =>
    props.$isScrolled ? "blur(10px)" : "none"};
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
  margin-top: ${(props) => props.$data.setting?.marginTop || "0"}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || "0"}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft || "0"}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight || "0"}px;
  border-radius: ${(props) => props.$data?.blocks?.setting?.bgRadius || "2"}px;
  box-shadow: ${(props) =>
    `${props.$data.blocks.setting?.shadowOffsetX || 0}px 
     ${props.$data.blocks.setting?.shadowOffsetY || 4}px 
     ${props.$data.blocks.setting?.shadowBlur || 10}px 
     ${props.$data.blocks.setting?.shadowSpread || 0}px 
     ${props.$data.blocks.setting?.shadowColor || "#fff"}`};
  ${(props) =>
    props.$isMobile &&
    `
    max-width: 425px;
    padding: 0;
    
    ${MainSection} {
      flex-direction: column;
      padding: 1rem;
      gap: 1rem;
    }
    
    ${Logo} {
      width: 40px;
      height: 40px;
    }
    
    ${NavContainer} {
      display: none;
    }
    
    ${ActionButtons} {
      width: 100%;
      justify-content: space-between;
      padding: 0 0.5rem;
    }
  `}
`;

const AnnouncementBar = styled.div<{
  $data: HeaderSection;
  $isScrolled: boolean;
}>`
  background-color: ${(props) =>
    props.$data.blocks?.setting?.announcementBgColor || "#f1b80c"};
  color: ${(props) =>
    props.$data.blocks?.setting?.announcementTextColor || "#ffffff"};
  text-align: center;
  font-size: ${(props) =>
    props.$data.blocks.setting?.announcementFontSize || "14"}px;
  font-weight: 500;
  letter-spacing: 0.025em;
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
  max-height: ${(props) => (props.$isScrolled ? "0" : "200px")};
  opacity: ${(props) => (props.$isScrolled ? "0" : "1")};
  padding: ${(props) => (props.$isScrolled ? "0" : "12px 24px")};
  border-top-left-radius: ${(props) =>
    props.$data?.blocks?.setting?.bgRadius || "2"}px;
  border-top-right-radius: ${(props) =>
    props.$data?.blocks?.setting?.bgRadius || "2"}px;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: ${(props) => (props.$isScrolled ? "0" : "8px 16px")};
  }
`;

const MainSection = styled.div`
  display: flex;
  min-width: 100%;
  align-items: center;
  justify-content: space-between;
  flex-direction: row-reverse;
  padding: 0rem 2rem;
  gap: 1rem;
  transition: padding 0.3s ease;
  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }
`;

const LogoContainer = styled.div`
  display: none;
  width: 100%;
  align-items: center;
  gap: 0.75rem;
  transition: transform 0.2s ease;

  @media (max-width: 768px) {
    width: fit-content;
  }
  @media (min-width: 768px) {
    display: flex;
  }
`;

const Logo = styled.img<{
  $data: HeaderSection;
}>`
  width: 60px;
  height: 60px;
  margin-left: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  padding: 0.75rem 2rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavList = styled.ul<{
  $data: HeaderSection;
  $isMobile: boolean;
}>`
  display: ${(props) => (props.$isMobile ? "none" : "flex")};
  align-items: center;
  flex-direction: row-reverse;
  gap: ${(props) => props.$data.blocks.setting?.gap || "1"}px;
`;

const NavItem = styled(Link)<{
  $data: HeaderSection;
}>`
  color: ${(props) => props.$data.blocks.setting?.itemColor || "#1f2937"};
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  text-align: right;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    color: ${(props) =>
      props.$data.blocks.setting?.itemHoverColor || "#f59e0b"};
    transform: translateY(-1px);
  }
`;

const MegaMenu = styled.div<{ isVisible?: boolean; $data: HeaderSection }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 800px;
  background-color: ${(props) =>
    props.$data.blocks?.setting?.megaMenuBg || "#ffffff"};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;
  display: flex;
  border-radius: ${(props) =>
    props.$data.blocks?.setting?.megaMenuRadius || "5"}px;
  padding: 2rem;
  direction: rtl;
  border: 1px solid #f1f5f9;

  &::before {
    content: "";
    position: absolute;
    top: -8px;
    right: 32px;
    width: 16px;
    height: 16px;
    background: ${(props) =>
      props.$data.blocks?.setting?.megaMenuBg || "#ffffff"};
    transform: rotate(45deg);
    border-left: 1px solid #f1f5f9;
    border-top: 1px solid #f1f5f9;
  }
`;

const NavItemWrapper = styled.li<{ $data?: HeaderSection }>`
  position: relative;
  list-style: none;
  &:hover ${MegaMenu} {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const CategoryItem = styled.span<{ $data: HeaderSection }>`
  color: ${(props) =>
    props.$data.blocks.setting?.categoryItemColor || "#64748b"};
  font-size: ${(props) =>
    props.$data.blocks.setting?.categoryItemSize || "14"}px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;

  &:hover {
    color: ${(props) =>
      props.$data.blocks.setting?.categoryItemHoverColor || "#3b82f6"};
  }
`;

const MegaMenuTitle = styled.h3<{ $data: HeaderSection }>`
  font-size: 1rem;
  color: ${(props) =>
    props.$data.blocks.setting?.categoryItemColor || "#64748b"};
  text-wrap: nowrap;
  text-align: right;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const CategoryIconWrapper = styled.div<{ $data: HeaderSection }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 15px;
  transition: transform 0.2s ease;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: rotate(180deg);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1.5rem;
  width: 100%;
  @media (max-width: 768px) {
    justify-content: space-between;
    gap: 1rem;
  }
`;

const MobileMenuButton = styled.button<{
  $isOpen: boolean;
  $isMobile: boolean;
}>`
  display: ${(props) => (props.$isMobile ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.5rem;
  z-index: 90;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    transition: transform 0.3s ease;
    color: #475569;
  }

  ${(props) =>
    props.$isOpen &&
    `
    svg {
      transform: rotate(90deg);
    }
  `}

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled.div<{
  $isOpen: boolean;
  $isMobile: boolean;
  $data: HeaderSection;
}>`
  display: ${(props) => (props.$isMobile && props.$isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  right: ${(props) => {
    if (props.$isMobile) {
      return "calc(50% - 212.5px)";
    }
    return "0";
  }};
  width: 85%;
  max-width: 340px;
  height: 100vh;
  background-color: ${(props) =>
    props.$data.blocks.setting?.mobileBackground || "#fff"};
  transform: translateX(${(props) => (props.$isOpen ? "0" : "100%")});
  opacity: 0.8; // 90% opacity برای کل element

  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) =>
    props.$isOpen ? "-8px 0 32px rgba(0, 0, 0, 0.12)" : "none"};
  z-index: 9999;
  overflow-y: auto;
  border-left: 1px solid #f1f5f9;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    right: 0;
    width: 80%;
    max-width: 320px;
    height: 100vh;
    z-index: 999;
  }
`;

const MobileMenuHeader = styled.div<{
  $data: HeaderSection;
}>`
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  background-color: ${(props) =>
    props.$data.blocks.setting?.mobileBackground || "#ffff"};
`;

const CloseButton = styled.button`
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e2e8f0;
    transform: rotate(90deg) scale(1.1);
  }

  svg {
    color: #64748b;
    transition: color 0.2s ease;
  }

  &:hover svg {
    color: #475569;
  }
`;

const MobileNavList = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: right;
`;

const MobileNavItem = styled(NavItem)`
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 900;
  width: 100%;
  display: block;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: ${(props) => props.$data.blocks.setting?.itemColor || "#1e293b"};
  text-decoration: none;

  &:hover {
    transform: translateX(-4px);
    color: ${(props) =>
      props.$data.blocks.setting?.itemHoverColor || "#f59e0b"};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
`;

const MobileDropdown = styled.div<{ $isOpen: boolean }>`
  max-height: ${(props) => (props.$isOpen ? "600px" : "0")};
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  margin: 0.5rem 0;
  border: 1px solid #e2e8f0;
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: ${(props) =>
    props.$isOpen ? "rgba(0, 0, 0, 0.4)" : "transparent"};
  z-index: 9998;
  transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(4px);

  @media (max-width: 768px) {
    position: fixed;
    height: 100vh;
    z-index: 998;
  }
`;

const MobileNavItemWrapper = styled.div`
  width: 100%;
`;

const MobileNavItemButton = styled.button<{ $data: HeaderSection }>`
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: ${(props) => props.$data.blocks.setting?.itemColor || "#1e293b"};
  background: none;
  border: none;
  text-align: right;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    transform: translateX(-4px);
    color: ${(props) =>
      props.$data.blocks.setting?.itemHoverColor || "#f59e0b"};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  svg {
    transition: transform 0.3s ease;
  }
`;

const MobileCategoryList = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MobileCategoryItem = styled(Link)<{ $data: HeaderSection }>`
  padding: 0.875rem 1.25rem;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) =>
    props.$data.blocks.setting?.categoryItemColor || "#64748b"};
  display: block;
  text-align: right;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;

  &:hover {
    background: #ffffff;
    transform: translateX(-2px);
    color: ${(props) =>
      props.$data.blocks.setting?.categoryItemHoverColor || "#3b82f6"};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
`;

const MobileCategoryTitle = styled.div`
  font-weight: 700;
  color: #1e293b;
  padding: 0.75rem 1.25rem;
  font-size: 15px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 13px;
`;

const Header: React.FC<HeaderProps> = ({ headerData, isMobile }) => {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [hoverd, setHoverd] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const { basic } = useUserInfo();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cateData = await response.json();
        setCategories(cateData);
      } catch (error) {
        console.log("Error fetching categories", error);
        // Default categories remain as fallback
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = useCallback(() => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);

    if (isMobile && window.innerWidth <= 768) {
      if (newState) {
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
      } else {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
      }
    }
  }, [isMenuOpen, isMobile]);

  const toggleMobileDropdown = useCallback(() => {
    setMobileDropdownOpen(!mobileDropdownOpen);
  }, [mobileDropdownOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOverlayClick = useCallback(() => {
    if (isMenuOpen) {
      toggleMenu();
    }
  }, [isMenuOpen, toggleMenu]);

  if (!mounted) {
    return null; // Or a loading skeleton
  }
  const sectionData = headerData as HeaderSection;

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
  const handleNavigate = () => {
    router.push(`/cart`);
  };
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isHeaderBlock(blocks)) {
    return null;
  }

  return (
    <HeaderWrapper
      $isMobile={isMobile}
      $data={sectionData}
      $isScrolled={isScrolled}
    >
      <AnnouncementBar $data={sectionData} $isScrolled={isScrolled}>
        {sectionData.blocks.setting?.announcementText ||
          "ارسال رایگان برای خرید‌های بالای ۵۰۰ هزار تومان!"}
      </AnnouncementBar>

      <MainSection>
        <div className="flex flex-row-reverse items-center gap-6 justify-start w-full">
          <MobileMenuButton
            $isOpen={isMenuOpen}
            $isMobile={isMobile}
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
          >
            <Menu size={20} />
          </MobileMenuButton>

          <LogoContainer>
            <Link className="ml-auto hidden lg:block" href="#">
              <Logo
                $data={sectionData}
                src={
                  basic?.logo ||
                  sectionData.blocks.imageLogo ||
                  "/assets/images/logo.webp"
                }
                alt={sectionData.blocks.imageAlt}
              />
            </Link>
          </LogoContainer>

          <NavContainer>
            <NavList $isMobile={isMobile} $data={sectionData}>
              {sectionData.blocks.links?.map((link, index) => (
                <NavItemWrapper key={index}>
                  {link.name === "دسته‌بندی کالاها" ? (
                    <>
                      <NavItem
                        className="text-nowrap"
                        href={link.url || "#"}
                        $data={sectionData}
                      >
                        <CategoryIconWrapper $data={sectionData}>
                          {link.name}
                          <MenuIcon size={16} />
                        </CategoryIconWrapper>
                      </NavItem>
                      <MegaMenu $data={sectionData}>
                        <div className="flex flex-col w-1/4 border-l border-gray-200 pl-4">
                          {categories
                            ?.filter((category) => category.children.length > 0)
                            .map((category, idx) => (
                              <Link
                                href={`/store?categoryId=${category._id}`}
                                key={category._id}
                                className="block"
                              >
                                <div
                                  className={`py-3 px-4 ml-2 cursor-pointer ${
                                    idx === hoverd
                                      ? " border-r-2 font-semibold  "
                                      : ""
                                  }`}
                                  onMouseEnter={() => setHoverd(idx)}
                                >
                                  <MegaMenuTitle $data={sectionData}>
                                    {category.name}
                                  </MegaMenuTitle>
                                </div>
                              </Link>
                            ))}
                        </div>

                        <div className="flex-1 p-6">
                          <div className="grid grid-cols-3 gap-6">
                            {categories
                              ?.filter(
                                (category) => category.children.length > 0
                              )
                              [hoverd]?.children.map((child) => (
                                <Link
                                  href={`/store?categoryId=${
                                    categories?.filter(
                                      (category) => category.children.length > 0
                                    )[hoverd]?._id
                                  }`}
                                  key={child._id}
                                  className="p-3 hover:translate-x-[2px] rounded-lg transition-all duration-300 text-right group"
                                >
                                  <CategoryItem $data={sectionData}>
                                    {child.name}
                                  </CategoryItem>
                                </Link>
                              ))}
                          </div>
                        </div>
                      </MegaMenu>
                    </>
                  ) : (
                    <NavItem
                      className="text-nowrap"
                      href={link.url}
                      $data={sectionData}
                    >
                      {link.name}
                    </NavItem>
                  )}
                </NavItemWrapper>
              ))}
            </NavList>
          </NavContainer>
          <ActionButtons>
            <div className="flex   items-center gap-2">
              {isAuthenticated && (
                <>
                  <ShoppingCart
                    className="cursor-pointer"
                    size={24}
                    onClick={handleNavigate}
                    style={{
                      color: sectionData.blocks.setting?.itemColor || "#f59e0b",
                    }}
                  />
                  |
                </>
              )}
              <UserMenu color={sectionData.blocks.setting?.itemColor} />
            </div>
          </ActionButtons>
        </div>
      </MainSection>

      <Overlay $isOpen={isMenuOpen} onClick={handleOverlayClick} />

      <MobileMenu
        ref={menuRef}
        $isMobile={isMobile}
        $isOpen={isMenuOpen}
        onClick={handleMenuClick}
        $data={sectionData}
        className="backdrop-blur-sm"
      >
        <MobileMenuHeader $data={sectionData}>
          <Logo
            $data={sectionData}
            src={
              basic?.logo ||
              sectionData.blocks.imageLogo ||
              "/assets/images/logo.webp"
            }
            alt={sectionData.blocks.imageAlt}
            style={{ width: "50px", height: "50px" }}
          />
          <CloseButton onClick={toggleMenu} aria-label="Close menu">
            <X size={18} />
          </CloseButton>
        </MobileMenuHeader>

        <MobileNavList>
          {sectionData.blocks.links?.map((link, index) => (
            <MobileNavItemWrapper key={index}>
              {link.name === "دسته‌بندی کالاها" ? (
                <>
                  <MobileNavItemButton
                    $data={sectionData}
                    onClick={toggleMobileDropdown}
                  >
                    {link.name}
                    {mobileDropdownOpen ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </MobileNavItemButton>

                  <MobileDropdown $isOpen={mobileDropdownOpen}>
                    <MobileCategoryList>
                      {categories
                        ?.filter((category) => category.children.length > 0)
                        .map((category) => (
                          <div key={category._id}>
                            <MobileCategoryTitle>
                              {category.name}
                            </MobileCategoryTitle>
                            {category.children.map((child) => (
                              <MobileCategoryItem
                                key={child._id}
                                href={`/store/${category._id}`}
                                $data={sectionData}
                                onClick={toggleMenu}
                              >
                                {child.name}
                              </MobileCategoryItem>
                            ))}
                          </div>
                        ))}
                    </MobileCategoryList>
                  </MobileDropdown>
                </>
              ) : (
                <MobileNavItem
                  href={link.url}
                  $data={sectionData}
                  onClick={toggleMenu}
                >
                  {link.name}
                </MobileNavItem>
              )}
            </MobileNavItemWrapper>
          ))}
        </MobileNavList>
      </MobileMenu>
    </HeaderWrapper>
  );
};

export default Header;
