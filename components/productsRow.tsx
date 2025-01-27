"use client";
import styled from "styled-components";
import ProductCard from "./productCard";
import { use, useRef, useState, useEffect } from "react";

interface ProductsRowProps {
  sections: any[];
  isMobile: boolean;
  componentName: string;
}

const ScrollContainer = styled.div<{
  $data: any;
}>`
  position: relative;
  width: 100%;
  padding-top: ${props => props.$data.setting?.paddingTop || "20"}px;
  padding-bottom: ${props => props.$data.setting?.paddingBottom || "20"}px;
  margin-top: ${props => props.$data.setting?.marginTop || "20"}px;
  margin-bottom: ${props => props.$data.setting?.marginBottom || "20"}px;
  background-color: ${props => props.$data.setting?.backgroundColor || "#ffffff"};
`;

const ProductsRowSection = styled.section<{
  $data: any;
  $isMobile: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
  max-width: 100%;
  overflow-x: scroll;
  scroll-behavior: smooth;
  gap: 8px;
  padding: ${props => props.$isMobile ? "10px" : "20px"};
  background-color: ${props => props.$data.setting?.backgroundColor || "#ffffff"};
  border-radius: ${props => props.$data.blocks?.setting?.cardBorderRadius || "8"}px;
  direction: rtl;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Heading = styled.h2<{
  $data: any;
  $isMobile: boolean;
}>`
  color: ${props => props.$data.blocks?.setting?.headingColor || "#000000"};
  font-size: ${props => props.$isMobile ? "24px" : `${props.$data.blocks?.setting?.headingFontSize || "32"}px`};
  font-weight: ${props => props.$data.blocks?.setting?.headingFontWeight || "bold"};
  text-align: right;
  margin-bottom: 20px;
`;

const ScrollButton = styled.button<{
  $data: any;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: "#FFFFFF";
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



export const ProductsRow: React.FC<ProductsRowProps> = ({ sections, isMobile, componentName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
const [products, setProducts] = useState([]);
const sectionData = sections.find((section) => section.type === componentName);
const [Loading, setLoading] = useState(true);
useEffect(() => {
    const fetchProducts = async () => {
    try {
      const response = await fetch('/api/store');
      const data = await response.json();
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
  fetchProducts();
},[]);

  if (!sectionData) return null;

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
if (Loading) {
    return <div>Loading...</div>; 
}
  return (
    <div className="px-2">
    <ScrollContainer $data={sectionData} className="border rounded-lg">
      <Heading $data={sectionData} $isMobile={isMobile} className="px-4">
        {sectionData.blocks?.textHeading}
      </Heading>

      <ProductsRowSection ref={containerRef} $data={sectionData} $isMobile={isMobile}>
        {products.map((product,idx) => (
          <ProductCard key={idx} productData={product} />
        ))}
      </ProductsRowSection>

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
    </div>
  );
};
