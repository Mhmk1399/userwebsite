import Image from "next/image";
import styled from "styled-components";
import {
  ProductCardSetting,
  ProductCardData,
  ProductBlockSetting,
} from "@/lib/types";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  productData: ProductCardData;
  settings?: ProductBlockSetting;
  previewWidth?: "sm" | "default";
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
  $setting?: ProductCardSetting;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: ${(props) =>
    props.$setting?.cardBorderRadius || defaultSetting.cardBorderRadius};
  background: ${(props) =>
    props.$setting?.cardBackground || defaultSetting.cardBackground};
  height: 380px;
  width: 100%;
  min-width: 250px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 426px) {
    padding: 0.5rem;
    height: 350px;
  }
`;

const ProductImage = styled(Image)<{
  $settings?: ProductCardSetting;
  $productData?: ProductCardData;
}>`
  object-fit: cover;
  width: 100%;
  height: 200px;
  border-radius: ${(props) =>
    props.$settings?.imageRadius || defaultSetting.imageRadius}px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
  if (props.$setting?.cardBorderRadius > 0) {
    border-radius-top: ${(props) => props.$settings?.imageRadius}px 0;
  }
`;

const ProductName = styled.h3<{
  $settings?: ProductCardSetting;
  $productData?: ProductCardData;
}>`
  font-size: ${(props) =>
    props.$settings?.nameFontSize || defaultSetting.nameFontSize}حط;
  font-weight: ${(props) =>
    props.$settings?.nameFontWeight || defaultSetting.nameFontWeight};
  color: ${(props) => props.$settings?.nameColor || defaultSetting.nameColor};
  margin: 8px 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 8px 0 6px;
  }
`;

const ProductDescription = styled.p<{
  $settings?: ProductCardSetting;
  $productData?: ProductCardData;
}>`
  font-size: ${(props) =>
    props.$settings?.descriptionFontSize ||
    defaultSetting.descriptionFontSize}حط;
  color: ${(props) =>
    props.$settings?.descriptionColor || defaultSetting.descriptionColor};
  font-weight: ${(props) =>
    props.$settings?.descriptionFontWeight ||
    defaultSetting.descriptionFontWeight};
  text-align: center;
  margin: 8px 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin: 6px 0 12px;
    -webkit-line-clamp: 1;
  }
`;

const ProductPrice = styled.span<{
  $settings?: ProductCardSetting;
  $productData?: ProductCardData;
}>`
  font-size: ${(props) =>
    props.$settings?.priceFontSize || defaultSetting.priceFontSize}حط;
  color: ${(props) => props.$settings?.priceColor || defaultSetting.pricecolor};
  font-weight: 700;
  margin: 8px 0;
  text-align: center;
`;

const AddToCartButton = styled.button<{
  $settings?: ProductBlockSetting;
  $productData?: ProductCardData;
}>`
  background-color: ${(props) => props.$settings?.cartBakground};
  color: ${(props) => props.$settings?.cartColor};
  border: none;
  padding: 8px 20px;
  border-radius: ${(props) => props.$settings?.cartRadius}px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${(props) => props.$settings?.cartBakground};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 6px 12px;
    margin-top: 6px;
  }
`;

const ProductCard: React.FC<ProductCardProps> = ({ productData, settings }) => {
  const router = useRouter();
  const safeProductData = {
    ...productData,
    images: productData.images || [
      {
        imageSrc: "/assets/images/pro2.jpg",
        imageAlt: "Product Image",
      },
    ],
  };
  const [currentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleNavigate = (_id: string) => {
    router.push(`/store/${_id}`);
  };

  const addToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingToCart(true);

    try {
      const db = await openDB();
      const transaction = (db as IDBDatabase).transaction("cart", "readwrite");
      const store = transaction.objectStore("cart");

      // Use _id or id, whichever is available
      const productId = productData._id || productData.id;

      // Check if item already exists
      const existingItem = await new Promise<CartItem | null>((resolve) => {
        const request = store.get(productId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
      });

      const cartItem = {
        id: productId,
        name: safeProductData.name || "Unnamed Product",
        price: parseFloat(
          safeProductData.price?.replace(/[^0-9.-]+/g, "") || "0"
        ),
        quantity: existingItem ? existingItem.quantity + 1 : 1,
        image: currentImage.imageSrc,
      };

      await store.put(cartItem);
      toast.success("محصول به سبد خرید اضافه شد");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("خطا در افزودن به سبد خرید");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const currentImage = safeProductData.images[currentImageIndex] || {
    imageSrc: "/assets/images/pro2.jpg",
    imageAlt: "Product Image",
  };

  // Use _id or id, whichever is available
  const productId = productData._id || productData.id;
  console.log(productId, "vvvvvvvvvv");

  return (
    <Card onClick={() => handleNavigate(productId)} dir="rtl">
      <ProductImage
        $settings={settings}
        $productData={safeProductData}
        src={currentImage.imageSrc}
        alt={currentImage.imageAlt}
        width={2000}
        height={2000}
      />

      <ProductName $settings={settings} $productData={productData}>
        {safeProductData.name || "Unnamed Product"}
      </ProductName>
      <ProductDescription $settings={settings} $productData={productData}>
        {productData.description.slice(0, 30)}...
      </ProductDescription>

      <ProductPrice $settings={settings} $productData={productData}>
        {productData.price}
      </ProductPrice>
      <AddToCartButton
        onClick={addToCart}
        disabled={isAddingToCart}
        $settings={settings}
        $productData={productData}
      >
        {isAddingToCart ? "در حال افزودن..." : "افزودن به سبد خرید"}
      </AddToCartButton>
    </Card>
  );
};

// IndexedDB helper function
async function openDB() {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open("CartDB", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("cart")) {
        db.createObjectStore("cart", { keyPath: "id" });
      }
    };
  });
}

export default ProductCard;
