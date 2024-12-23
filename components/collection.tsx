"use client"
import { CollectionBlockSetting, CollectionSection } from "@/lib/types";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";

interface CollectionProps {
  sections: {
    Collection: CollectionSection[];
  };
  isMobile: boolean;
}
interface ProductData {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  btnText: string;
}

const CollectionWrapper = styled.div<{
  $setting: CollectionBlockSetting;
  $isMobile: boolean;
}>`
  padding-top: ${(props) => props.$setting?.paddingTop}px;
  padding-bottom: ${(props) => props.$setting?.paddingBottom}px;
  padding-right: ${(props) => props.$setting?.paddingRight}px;
  padding-left: ${(props) => props.$setting?.paddingLeft}px;
  margin-top: ${(props) => props.$setting?.marginTop}px;
  margin-bottom: ${(props) => props.$setting?.marginBottom}px;
  background-color: ${(props) => props.$setting?.backgroundColor};
  // width: ${(props) => (props.$isMobile ? "425px" : "100%")};
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 12px;
`;
const Heading = styled.h2<{ $setting: CollectionBlockSetting }>`
  color: ${(props) => props.$setting?.headingColor};
  font-size: ${(props) => props.$setting?.headingFontSize}px;
  font-weight: ${(props) => props.$setting?.headingFontWeight};
  text-align: center;
`;

const ProductGrid = styled.div<{
  $setting: CollectionBlockSetting;
  $isMobile: boolean;
}>`
  display: grid;
  grid-template-columns: repeat(
    ${(props) => (props.$isMobile ? "1" : "3")},
    1fr
  );
  gap: 10px;
  padding: 10px;
`;

const ProductCard = styled.div<{
  $setting: CollectionBlockSetting;
  $isLarge?: boolean;
}>`
  background: ${(props) => props.$setting.cardBackground};
  border-radius: ${(props) => props.$setting.cardBorderRadius}px;
  overflow: hidden;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  &:hover {
    transform: scale(0.99);
  }
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  // width: ${(props) => (props.$isLarge ? "100%" : "calc(49% - 100px)")};
`;

const ProductImage = styled.img<{ $setting: CollectionBlockSetting }>`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: ${(props) => props.$setting.imageRadius}px;
`;

const ProductInfo = styled.div`
  padding: 16px;
`;

const ProductName = styled.h3<{ $setting: CollectionBlockSetting }>`
  color: ${(props) => props.$setting.productNameColor};
`;

const ProductPrice = styled.div<{ $setting: CollectionBlockSetting }>`
  color: ${(props) => props.$setting.priceColor};
  font-size: 16px;
  margin: 8px 0;
`;

const BuyButton = styled(Link)<{ $setting: CollectionBlockSetting }>`
  background: ${(props) => props.$setting.btnBackgroundColor};
  color: ${(props) => props.$setting.btnTextColor};
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }
`;

export const Collection: React.FC<CollectionProps> = ({
  sections: { Collection },
  isMobile,
}) => {
  // const [products, setProducts] = useState<ProductData[]>([]);

  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);

  // Modify your useEffect to handle collections
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/collections");
        const data = await response.json();

        const collectionData = data.collections || [];
        setCollections(collectionData);
        // Set initial filtered products from 'all' collection
        const allCollection = data.collections.find(
          (c: any) => c.name === "all"
        );
        if (allCollection) {
          const formattedProducts = allCollection.products.map(
            (product: any) => ({
              id: product._id,
              name: product.name,
              price: product.price,
              imageSrc: product.images?.imageSrc || "/assets/images/pro2.jpg",
              imageAlt: product.images?.imageAlt || product.name,
              btnText: "خرید محصول",
            })
          );
          setFilteredProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const collectionName = e.target.value;
    setSelectedCollection(collectionName);

    const selectedCollectionData = collections.find(
      (c) => c.name === collectionName
    );
    if (selectedCollectionData) {
      const formattedProducts = selectedCollectionData.products.map(
        (product: any) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          imageSrc: product.images?.imageSrc || "/assets/images/pro2.jpg",
          imageAlt: product.images?.imageAlt || product.name,
          btnText: "خرید محصول",
        })
      );
      setFilteredProducts(formattedProducts);
    }
  };

  const sectionData = Collection[0];
  if (!sectionData?.setting) {
    return null; // or return a loading state/placeholder
  }

  // console.log(sectionData);

  return (
    <>
      <Heading $setting={sectionData.setting}>
        {sectionData.blocks.heading}
      </Heading>
      <div className="flex justify-center px-6 my-4">
        <select
          value={selectedCollection}
          onChange={handleCollectionChange}
          className="p-2 border rounded-lg bg-white shadow-sm"
          style={{
            color: sectionData.setting.headingColor,
            borderColor: sectionData.setting.btnBackgroundColor,
          }}
        >
          {collections.map((collection) => (
            <option key={collection._id} value={collection.name}>
              {collection.name}
            </option>
          ))}
        </select>
      </div>
      <CollectionWrapper
        $isMobile={isMobile}
        dir="rtl"
        $setting={sectionData.setting}
      >
        <ProductGrid $setting={sectionData.setting} $isMobile={isMobile}>
          {filteredProducts.slice(0, 3).map((product, index) => (
            <ProductCard
              key={product.id}
              $setting={sectionData.setting}
              $isLarge={index === 0}
              style={
                index === 0
                  ? { height: "100%" }
                  : { height: "calc(50% - 10px)" }
              }
            >
              <ProductImage
                src={product.imageSrc || "/assets/images/pro2.jpg"}
                alt={product.imageAlt}
                $setting={sectionData.setting}
              />
              <ProductInfo>
                <ProductName $setting={sectionData.setting}>
                  {product.name}
                </ProductName>
                <ProductPrice $setting={sectionData.setting}>
                  {product.price}
                </ProductPrice>
                <BuyButton
                  href={`/detailpages/${product.id}`}
                  $setting={sectionData.setting}
                >
                  {product.btnText}
                </BuyButton>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      </CollectionWrapper>
    </>
  );
};