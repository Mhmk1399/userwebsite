import Image from "next/image";
import styled from "styled-components";
import { productCard, ProductCardData } from "@/lib/types";
import { useState } from "react";

interface ProductCardProps {
  productData: ProductCardData;
}
const defaultSetting = {
  cardBorderRadius: "10px",
  cardBackground: "#ffffff",
  imageWidth: "100%",
  imageheight: "200px",
  imageRadius: "8px",
  nameFontSize: "1.2rem",
  nameFontWeight: "bold",
  nameColor: "#000000",
  descriptionFontSize: "0.9rem",
  descriptionFontWeight: "normal",
  descriptionColor: "#666",
  priceFontSize: "1rem",
  pricecolor: "#000000",
  btnBackgroundColor: "#e5e5e5",
  btnColor: "#000000",
};

const Card = styled.div<{
  $setting?: productCard;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: ${(props) =>
    props.$setting?.cardBorderRadius || defaultSetting.cardBorderRadius};
  background: ${(props) =>
    props.$setting?.cardBackground || defaultSetting.cardBackground};
  margin: 10px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 400px;
  width: 350px;
  min-height: 400px;
  @media (max-width: 425px) {
    margin: 10px 5px;
    height: 450px;
  }
`;

const ProductImage = styled(Image)<{
  $settings?: productCard;
  $productData?: ProductCardData;
}>`
  object-fit: cover;
  width: ${(props) => props.$settings?.imageWidth || defaultSetting.imageWidth};
  height: ${(props) =>
    props.$settings?.imageheight || defaultSetting.imageheight};
  border-radius: ${(props) =>
    props.$settings?.imageRadius || defaultSetting.imageRadius};
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.01);
  }
`;

const ProductName = styled.h3<{
  $settings?: productCard;
  $productData?: ProductCardData;
}>`
  font-size: ${(props) =>
    props.$settings?.nameFontSize || defaultSetting.nameFontSize};
  font-weight: ${(props) =>
    props.$settings?.nameFontWeight || defaultSetting.nameFontWeight};
  color: ${(props) => props.$settings?.nameColor || defaultSetting.nameColor};
  margin: 8px 0;
  text-align: center;
`;

const ProductDescription = styled.p<{
  $settings?: productCard;
  $productData?: ProductCardData;
}>`
  font-size: ${(props) =>
    props.$settings?.descriptionFontSize || defaultSetting.descriptionFontSize};
  color: ${(props) =>
    props.$settings?.descriptionColor || defaultSetting.descriptionColor};
  font-weight: ${(props) =>
    props.$settings?.descriptionFontWeight ||
    defaultSetting.descriptionFontWeight};
  text-align: center;
  margin: 8px 0;
`;

const ProductPrice = styled.span<{
  $settings?: productCard;
  $productData?: ProductCardData;
}>`
  font-size: ${(props) =>
    props.$settings?.priceFontSize || defaultSetting.priceFontSize};
  font-weight: ${(props) =>
    props.$settings?.pricecolor || defaultSetting.pricecolor};
  margin: 8px 0;
`;

// const BuyButton = styled.button<{
//   $settings?: productCard;
//   $productData?: ProductCardData;
//   onClick?: () => void;
// }>`
//   display: inline-block;
//   padding: 10px 20px;
  
//   background-color: ${(props) =>
//     props.$settings?.btnBackgroundColor || defaultSetting.btnBackgroundColor};
//   color: ${(props) => props.$settings?.btnColor || defaultSetting.btnColor};
//   border-radius: 4px;
//   font-size: 0.9rem;
//   font-weight: bold;
//   margin-top: auto;
//   text-align: center;
//   transition: all 0.3s ease;

//   &:hover {
//     background-color: #d5d5d5;
//     transform: translateY(-2px);
//   }
// `;

const ProductCard: React.FC<ProductCardProps> = ({ productData }) => {
  const safeProductData = {
    ...productData,
    images: productData.images || [
      {
        imageSrc: "/assets/images/pro2.jpg",
        imageAlt: "Product Image",
      },
    ],
  };
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const currentImage = safeProductData.images[currentImageIndex] || {
    
    imageSrc: "/assets/images/pro2.jpg",
    imageAlt: "Product Image",
  };
  console.log(setCurrentImageIndex);

  return (
    <Card dir="rtl" className="min-w-[220px] min-h-[350px]">
      <ProductImage
        $productData={safeProductData}
        src={currentImage.imageSrc}
        alt={currentImage.imageAlt}
        width={4000}
        height={4000}
      />
      <ProductName $productData={safeProductData}>
        {safeProductData.name || "Unnamed Product"}
      </ProductName>
      <ProductDescription $productData={safeProductData}>
        {safeProductData.description || "No description available"}
      </ProductDescription>
      <ProductPrice $productData={safeProductData}>
        {safeProductData.price !== undefined
          ? safeProductData.price
          : "Price not available"}
      </ProductPrice>
     
     
    </Card>
  );
};
export default ProductCard;
