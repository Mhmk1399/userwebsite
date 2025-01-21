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

const SpecialOfferSection = styled.section<{
    $data:SpecialOfferSection;
    $isMobile: boolean;
  }>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: relative;
    width: 100%;
    height: auto;
    max-width: 100%;
    overflow-x: hidden; // Hide horizontal scrollbar
    overflow-y: hidden; // Hide vertical scrollbar
    scroll-behavior: smooth; // Add smooth scrolling
    gap: 8px;
    padding: 20px;
    background-color: #ef394e;
    border-radius: 8px;
    margin: 20px 0;
    position: relative; // For absolute positioning of scroll buttons
  `;
  
  const ScrollButton = styled.button`
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.9);
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
console.log(sections);

  useEffect(() => {
    const fetchSpecialOffers = async () => {
      try {
        const response = await fetch("/api/store"); // Your special offers endpoint
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

  const sectionData = sections.find(
    (section) => section.type === componentName
  ) 

  if (!sectionData) {
    return <div>No special offers available</div>;
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition = containerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      containerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <SpecialOfferSection ref={containerRef} $data={sectionData} $isMobile={isMobile}>
        <ScrollButton className="left" onClick={() => handleScroll('left')}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
          </svg>
        </ScrollButton>
        
        {specialOfferProducts.map((product) => (
          <ProductCard key={product._id} productData={product} />
        ))}
        
        <div className="flex text-white flex-col items-center justify-center gap-y-10 px-10">
          <h2 className="text-3xl text-center font-bold">{sectionData.blocks?.textHeading}</h2>
          <svg xmlns="http://www.w3.org/2000/svg" height="80px" viewBox="0 -960 960 960" width="80px" fill="#FFFFFF">
            <path d="M300-520q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T360-660q0-25-17.5-42.5T300-720q-25 0-42.5 17.5T240-660q0 25 17.5 42.5T300-600Zm360 440q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T720-300q0-25-17.5-42.5T660-360q-25 0-42.5 17.5T600-300q0 25 17.5 42.5T660-240Zm-444 80-56-56 584-584 56 56-584 584Z"/>
          </svg>
        </div>

        <ScrollButton className="right" onClick={() => handleScroll('right')}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </ScrollButton>
      </SpecialOfferSection>
    </div>
  );
};