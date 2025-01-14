"use client";
import styled from "styled-components";
import { ProductSection, ProductCardData } from "@/lib/types";
import ProductCard from "./productCard";
import { useEffect, useState } from "react";

interface ProductListProps {
  sections: ProductSection[];
  isMobile: boolean;
  componentName: string;
}

const SectionProductList = styled.section<{
  $data: ProductSection;
  $isMobile: boolean;
}>`
  display: grid;
  grid-template-columns: repeat(
    ${(props) => props.$data.setting?.gridColumns},
    1fr
  );
  gap: 8px;
  padding-top: ${(props) => props.$data?.setting?.paddingTop}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom}px;
  background-color: ${(props) => props.$data?.setting?.backgroundColor};
  @media (max-width: 425px) {
    grid-template-columns: repeat(1, 2fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 2fr);
  }
`;

const ProductList: React.FC<ProductListProps> = ({ sections, isMobile, componentName }) => {
  const [productData, setProductData] = useState<ProductCardData[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/store");
        const data = await response.json();

        if (data?.products) {
          const productInfo = data.products.map((product: { _id: string }) => ({
            ...product,
            _id: product._id, // Ensure _id is preserved
          }));
          console.log(productInfo);
          setProductData(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const sectionData = sections.find(
    (section) => section.type === componentName
  );
console.log(sectionData);

  if (!sectionData) {
    return <div>No data available</div>;
  }

  return (
    <SectionProductList $data={sectionData} $isMobile={isMobile}>
      {productData.map((product) => (
        <ProductCard key={product._id} productData={product} />
      ))}
    </SectionProductList>
  );
};

export default ProductList;
