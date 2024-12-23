"use client";
import styled from "styled-components";
import { ProductSection, ProductCardData } from "@/lib/types";
import ProductCard from "./productCard";
import { useEffect, useState } from "react";

interface ProductListProps {
  sections: {
    ProductList: ProductSection[];
  };
  isMobile: boolean;
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

const ProductList: React.FC<ProductListProps> = ({
  sections: { ProductList },
  isMobile,
}) => {
  const [productData, setProductData] = useState<ProductCardData[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (data?.products) {
          const productInfo = data.products.map((product: any) => ({
            ...product,
            images: product.images || [],
          }));
          console.log(productInfo);

          setProductData(productInfo);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const sectionData = ProductList[0];

  console.log(sectionData, "sectionData PPPPP");

  if (!sectionData) {
    return null;
  }
  const displayProducts =
    productData.length > 0
      ? productData
      : Object.entries(sectionData.blocks)
          .filter(([key]) => key !== "setting")
          .map(([key, block]) => ({
            id: key,
            name: block.name || "Product Name",
            price: block.price || 0,
            imageSrc: block.imageSrc || "/default-image.jpg",
            imageAlt: block.imageAlt || "Product Image",
            btnText: block.btnText || "Buy Now",
          }));

  return (
    <SectionProductList $data={sectionData} $isMobile={isMobile}>
      {displayProducts.map((block, index) => (
        <div className="p-0 m-0" key={`${block.id}-${index}`}>
          <ProductCard productData={block} />
        </div>
      ))}
    </SectionProductList>
  );
};

export default ProductList;
