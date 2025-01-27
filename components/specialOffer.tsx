"use client";
import styled from "styled-components";
import {  ProductCardData } from "@/lib/types";
import type { SpecialOfferSection } from "@/lib/types";
import ProductCard from "./productCard";
import { useEffect, useState } from "react";
import { useRef } from "react";
interface SpecialOfferProps {
  sections: SpecialOfferSection[];
  isMobile: boolean;
  componentName: string;
}

const ScrollContainer = styled.div<{
    $data: SpecialOfferSection;
  }>`
    position: relative;
    width: 100%;
    padding-top: ${props => props.$data.setting?.paddingTop || "20"}px;
    padding-bottom: ${props => props.$data.setting?.paddingBottom || "20"}px;
    margin-top: ${props => props.$data.setting?.marginTop || "20"}px;
    margin-bottom: ${props => props.$data.setting?.marginBottom || "20"}px;
    background-color: ${props => props.$data.setting?.backgroundColor || "#ef394e"};
  `;
  
  const SpecialOfferSection = styled.section<{
    $data: SpecialOfferSection;
    $isMobile: boolean;
  }>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: auto;
    max-width: 100%;
    overflow-x: scroll;
    scroll-behavior: smooth;
    gap: 8px;
    padding: ${props => props.$isMobile ? "10px" : "20px"};
    background-color: ${props => props.$data.blocks?.setting?.backgroundColor || "#ef394e"};
    border-radius: ${props => props.$data.blocks?.setting?.cardBorderRadius || "8"}px;
    direction: rtl;
  
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  `;
  
  const Heading = styled.h2<{
    $data: SpecialOfferSection;
    $isMobile: boolean;
  }>`
    color: ${props => props.$data.blocks?.setting?.headingColor || "#FFFFFF"};
    font-size: ${props => props.$isMobile ? "24px" : `${props.$data.blocks?.setting?.headingFontSize || "32"}px`};
    font-weight: ${props => props.$data.blocks?.setting?.headingFontWeight || "bold"};
    text-align: center;
  `;
  
  const ScrollButton = styled.button<{
    $data: SpecialOfferSection;
  }>`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background:"#FFFFFF";
    color: ${props => props.$data.blocks?.setting?.btnTextColor || "#000000"};
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
    &.left {
      left: 10px;
    }
  
    &.right {
      right: 10px;
    }
  `;
  
  export const SpecialOffer: React.FC<SpecialOfferProps> = ({ sections, isMobile, componentName }) => {
    const [specialOfferProducts, setSpecialOfferProducts] = useState<ProductCardData[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
  
    const sectionData = sections.find((section) => section.type === componentName);
  
    useEffect(() => {
      const fetchSpecialOffers = async () => {
        try {
          const response = await fetch("/api/store");
          const data = await response.json();
          if (data?.products) {
            setSpecialOfferProducts(data.products);
          }
        } catch (error) {
          console.error("Error fetching special offers:", error);
        }
      };
  
      fetchSpecialOffers();
    }, []);
  
    if (!sectionData) {
      return <div>No special offers available</div>;
    }
  
    const handleScroll = (direction: 'left' | 'right') => {
      if (containerRef.current) {
        const scrollAmount = 400;
        const newScrollPosition = containerRef.current.scrollLeft + (direction === 'left' ? scrollAmount : -scrollAmount);
        containerRef.current.scrollTo({
          left: newScrollPosition,
          behavior: 'smooth'
        });
      }
    };
  
    return (
      <ScrollContainer $data={sectionData} className=" rounded-lg">
        <SpecialOfferSection ref={containerRef} $data={sectionData} $isMobile={isMobile}>
          <div className="flex flex-col items-center justify-center gap-y-10 lg:px-10">
            <Heading $data={sectionData} $isMobile={isMobile}>
              {sectionData.blocks?.textHeading}
            </Heading>
            <svg xmlns="http://www.w3.org/2000/svg" height="80px" viewBox="0 -960 960 960" width="80px" fill="#FFFFFF">
              <path d="M300-520q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T360-660q0-25-17.5-42.5T300-720q-25 0-42.5 17.5T240-660q0 25 17.5 42.5T300-600Zm360 440q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T720-300q0-25-17.5-42.5T660-360q-25 0-42.5 17.5T600-300q0 25 17.5 42.5T660-240Zm-444 80-56-56 584-584 56 56-584 584Z"/>
            </svg>
          </div>
          
          {specialOfferProducts.map((product) => (
            <ProductCard key={product._id} productData={product} />
          ))}
        </SpecialOfferSection>
  
        <ScrollButton className="left bg-white" onClick={() => handleScroll('left')} $data={sectionData}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
          </svg>
        </ScrollButton>
  
        <ScrollButton className="right bg-white" onClick={() => handleScroll('right')} $data={sectionData}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </ScrollButton>
      </ScrollContainer>
    );
  };
  