"use client";
import {
  HeaderSection,
  HeaderBlock,
} from "@/lib/types";

import data from "@/public/template/homelg.json";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";



// Styled components
const SectionHeader = styled.section<{
  $data: HeaderSection;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  flex-direction: row-reverse;
  padding-top: ${(props) => props.$data.setting.paddingTop || "0"}px;
  padding-bottom: ${(props) => props.$data.setting.paddingBottom || "0"}px;
  margin-top: ${(props) => props.$data.setting.marginTop || "0"}px;
  margin-bottom: ${(props) => props.$data.setting.marginBottom || "25"}px;
  background-color: ${(props) =>
    props.$data?.blocks?.setting?.backgroundColorNavbar || "#14213D"};
  position: fixed;
  width: 100%;
  z-index: 40;
`;

const LogoContainer = styled.div<{
  $data: HeaderSection;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 1rem;
  position: relative;

  @media (min-width: 768px) {
    width: auto;
    justify-content: flex-start;
  }
`;

const Logo = styled.img<{
  $data: HeaderSection;
}>`
  width: ${(props) => props.$data.blocks.setting.imageWidth || "auto"}px;
  height: ${(props) => props.$data.blocks.setting.imageHeight || "auto"}px;
  margin-right: ${(props) => props.$data.blocks.setting.marginRight || "0"}px;
  margin-left: ${(props) => props.$data.blocks.setting.marginLeft || "0"}px;
  transition: all 0.3s ease-in-out;
  position: relative;
  transform: translateX(
    ${(props) =>
      `calc(${props.$data.blocks.setting.marginRight || 0}px - ${
        props.$data.blocks.setting.marginLeft || 0
      }px)`}
  );
`;

const NavItems = styled.div<{
  $isOpen: boolean;
  $data: HeaderSection;
}>`
  display: flex;
  flex-direction: row-reverse;
  gap: 2rem;
  transition: all 0.3s ease-in-out;
  justify-content: space-around;

  @media (min-width: 768px) {
    flex-direction: row-reverse;
    align-items: center;
    justify-content: flex-end;
    opacity: 1;
    visibility: visible;
    transform: none;
    max-height: none;
    width: auto;
  }

  @media (max-width: 767px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: ${(props) =>
      props.$data?.blocks?.setting?.backgroundColorNavbar || "#14213D"};
    align-items: center;
    justify-content: center;
    width: 100%;
    max-height: ${({ $isOpen }) => ($isOpen ? "500px" : "0")};
    opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
    overflow: hidden;
    visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
    transform: translateY(${({ $isOpen }) => ($isOpen ? "0" : "-20px")});
    padding: ${({ $isOpen }) => ($isOpen ? "1rem 0" : "0")};
  }
`;

const NavItem = styled(Link)<{
  $data: HeaderSection;
}>`
  color: ${(props) => props.$data.blocks.setting.itemColor || "#000"};
  font-size: ${(props) => props.$data.blocks.setting.itemFontSize || "14"}px;
  font-weight: ${(props) =>
    props.$data.blocks.setting.itemFontWeight || "normal"};
  padding: 0.5rem 1rem;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: ${(props) => props.$data.blocks.setting.itemHoverColor || "#000"};
  }
`;

const MenuButton = styled.button<{
  $data: HeaderSection;
}>`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${(props) => props.$data.blocks.setting.itemColor || "#000"};

  @media (max-width: 767px) {
    display: block;
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sectionData = data.sections.sectionHeader as HeaderSection;
  if (!mounted) {
    return null;
  }
  // const isHeaderSection = (section: SectionType): section is HeaderSection => {
  //   return section?.type === "header" && "blocks" in section;
  // };

  // if (!sectionData || !isHeaderSection(sectionData)) {
  //   //  ("Section data is missing or invalid.");
  //   return null;
  // }

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

  const { imageLogo, imageAlt, links } = blocks;

  return (
    <SectionHeader $data={sectionData}>
      <LogoContainer $data={sectionData}>
        <Logo
          className={`${isOpen ? "hidden" : "block"}`}
          $data={sectionData}
          src={imageLogo || "/assets/images/logo.webp"}
          alt={imageAlt}
        />

        <MenuButton
          className="fixed"
          $data={sectionData}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "X" : "☰"}
        </MenuButton>
      </LogoContainer>
      <NavItems $isOpen={isOpen} $data={sectionData}>
        {links?.map((link, index) => (
          <NavItem $data={sectionData} key={index} href={link.url}>
            {link.name}
          </NavItem>
        ))}
      </NavItems>
    </SectionHeader>
  );
};
export default Header;
