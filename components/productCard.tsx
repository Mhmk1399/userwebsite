import Image from "next/image";
import styled from "styled-components";
import { ProductCardSetting, ProductCardData } from "@/lib/types";

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
  align-items: flex-start;
  border-radius: ${(props) =>
    props.$setting?.cardBorderRadius || defaultSetting.cardBorderRadius};
  background: ${(props) =>
    props.$setting?.cardBackground || defaultSetting.cardBackground};
  padding: 1rem;
  height: 450px;
  width: 100%;
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
  width: ${(props) => props.$settings?.imageWidth || defaultSetting.imageWidth};
  height: ${(props) =>
    props.$settings?.imageHeight || defaultSetting.imageheight};
  border-radius: ${(props) =>
    props.$settings?.imageRadius || defaultSetting.imageRadius};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    height: 180px;
  }

  @media (max-width: 426px) {
    height: 160px;
  }
`;

const ProductName = styled.h3<{
  $settings?: ProductCardSetting;
  $productData?: ProductCardData;
}>`
  font-size: ${(props) =>
    props.$settings?.nameFontSize || defaultSetting.nameFontSize};
  font-weight: ${(props) =>
    props.$settings?.nameFontWeight || defaultSetting.nameFontWeight};
  color: ${(props) => props.$settings?.nameColor || defaultSetting.nameColor};
  margin: 12px 0 8px;
  line-height: 1.4;

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
    props.$settings?.descriptionFontSize || defaultSetting.descriptionFontSize};
  color: ${(props) =>
    props.$settings?.descriptionColor || defaultSetting.descriptionColor};
  font-weight: ${(props) =>
    props.$settings?.descriptionFontWeight ||
    defaultSetting.descriptionFontWeight};
  line-height: 1.6;
  margin: 8px 0 16px;
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
    props.$settings?.priceFontSize || defaultSetting.priceFontSize};
  color: ${(props) => props.$settings?.priceColor || defaultSetting.pricecolor};
  font-weight: bold;
  padding: 4px 0;
  display: block;
  text-align: center;
  width: 100%;
  border-radius: 6px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 3px 0;
  }
`;

const AddToCartButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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

const ProductCard: React.FC<ProductCardProps> = ({ productData }) => {
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
    <Card
      onClick={() => handleNavigate(productId)}
      dir="rtl"
      className="min-w-0"
    >
      <ProductImage
        $productData={safeProductData}
        src={currentImage.imageSrc}
        alt={currentImage.imageAlt}
        width={300}
        height={200}
        sizes="(max-width: 768px) 100vw, 300px"
      />
      <div className="flex flex-col p-2 w-full flex-1">
        <ProductName className="" $productData={safeProductData}>
          {safeProductData.name || "Unnamed Product"}
        </ProductName>
        <ProductDescription $productData={safeProductData}>
          {safeProductData.description || "No description available"}
        </ProductDescription>
        <div className="mt-auto">
          <div className="w-full   bg-red-50 hover:bg-red-100 transition-all duration-200 flex justify-center items-center p-2">
            <ProductPrice
              className="text-black font-extralight leading-4 text-center w-full"
              $productData={safeProductData}
            >
              {safeProductData.price !== undefined
                ? `${safeProductData.price} تومان`
                : "Price not available"}
            </ProductPrice>
          </div>
          <AddToCartButton onClick={addToCart} disabled={isAddingToCart}>
            {isAddingToCart ? "در حال افزودن..." : "افزودن به سبد خرید"}
          </AddToCartButton>
        </div>
      </div>
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
