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
import { cartService } from "@/lib/cartService";

interface ProductCardProps {
  productData: ProductCardData;
  settings?: ProductBlockSetting;
  previewWidth?: "sm" | "default";
}

const Card = styled.div<{
  $setting?: ProductCardSetting;
}>`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  border-radius: ${(props) => props.$setting?.cardBorderRadius}px;
  background-color: ${(props) => props.$setting?.cardBackground};
  height: 380px;
  min-width: 250px;
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
  width: 100%;
  height: 200px;
  border-radius: ${(props) => props.$settings?.imageRadius}px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 426px) {
    height: 160px;
    aspect-ratio: 1;
  }
`;

const ProductName = styled.h3<{
  $settings?: ProductCardSetting;
  $productData?: ProductCardData;
}>`
  font-size: ${(props) => props.$settings?.nameFontSize}px;
  font-weight: ${(props) => props.$settings?.nameFontWeight};
  color: ${(props) => props.$settings?.nameColor};
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
  font-size: ${(props) => props.$settings?.descriptionFontSize}px;
  color: ${(props) => props.$settings?.descriptionColor};
  font-weight: ${(props) => props.$settings?.descriptionFontWeight};
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
  $settings?: ProductBlockSetting;
  $productData?: ProductCardData;
}>`
  font-size: ${(props) => props.$settings?.priceFontSize}px;
  color: ${(props) => props.$settings?.priceColor || "#ffffff"};
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
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  // Early return if productData is null or undefined
  if (!productData) {
    console.log("ProductCard: productData is null or undefined");
    return null;
  }
  console.log(productData, "mmmmmmmmmm");

  try {
    // Use actual product image or fallback
    // const imageSrc =
    //   productData?.images?.[0]?.imageSrc || "/assets/images/pro2.jpg";
    const currentImage = {
      imageSrc: productData?.images?.[0]?.imageSrc || "/assets/images/pro2.jpg",
      imageAlt:
        productData?.images?.[0]?.imageAlt ||
        productData?.name ||
        "Product Image",
    };

    // Handle products from collections
    const safeProductData = {
      ...productData,
      images: productData?.images || [currentImage],
    };

    const handleNavigate = (_id: string) => {
      router.push(`/store/${_id}`);
    };

    const addToCart = async (e: React.MouseEvent) => {
      e.stopPropagation();

      // Check if user has token
      const token = localStorage.getItem("tokenUser");
      if (!token) {
        toast.error("برای افزودن به سبد خرید ابتدا وارد شوید");
        router.push("/login");
        return;
      }

      setIsAddingToCart(true);

      try {
        // Use _id or id, whichever is available
        const productId = productData._id || productData.id;

        // Calculate final price with discount
        const originalPrice = parseFloat(
          safeProductData.price?.replace(/[^0-9.-]+/g, "") || "0"
        );
        const finalPrice =
          productData.discount && Number(productData.discount) > 0
            ? originalPrice * (1 - Number(productData.discount) / 100)
            : originalPrice;

        const cartItem = {
          productId: productId,
          name: safeProductData.name || "Unnamed Product",
          price: finalPrice,
          quantity: 1,
          image: currentImage.imageSrc,
        };

        await cartService.addToCart(cartItem);
        toast.success("محصول به سبد خرید اضافه شد");
      } catch (error) {
        console.log("Error adding to cart:", error);
        toast.error("خطا در افزودن به سبد خرید");
      } finally {
        setIsAddingToCart(false);
      }
    };

    // Use _id or id, whichever is available
    const productId = productData?._id || productData?.id || "unknown";
    console.log(productId, "vvvvvvvvvv");

    return (
      <Card
        $setting={settings}
        onClick={() => handleNavigate(productId)}
        dir="rtl"
      >
        {productData?.discount && Number(productData.discount) > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            {Number(productData.discount).toLocaleString("fa-IR")}%
          </span>
        )}

        <ProductImage
          $settings={settings}
          $productData={safeProductData}
          src={currentImage.imageSrc}
          alt={currentImage.imageAlt}
          width={2000}
          height={1000}
        />

        <ProductName $settings={settings} $productData={productData}>
          {safeProductData.name || "Unnamed Product"}
        </ProductName>
        <ProductDescription $settings={settings} $productData={productData}>
          {productData?.description
            ? productData.description.slice(0, 30) + "..."
            : "توضیحات موجود نیست"}
        </ProductDescription>

        <div className="text-center mb-2">
          {productData?.discount && Number(productData.discount) > 0 ? (
            <>
              <ProductPrice $settings={settings} $productData={productData}>
                {(
                  Number(productData.price) *
                  (1 - Number(productData.discount) / 100)
                ).toLocaleString("fa-IR")}{" "}
                تومان
                <span className="text-red-400 mr-3 line-through text-xs">
                  {Number(productData.price).toLocaleString("fa-IR")}
                </span>
              </ProductPrice>
            </>
          ) : (
            <ProductPrice $settings={settings} $productData={productData}>
              {productData?.price
                ? Number(productData.price).toLocaleString("fa-IR")
                : "قیمت مشخص نشده"}{" "}
              تومان
            </ProductPrice>
          )}
        </div>
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
  } catch (error) {
    console.log("ProductCard error:", error, "productData:", productData);
    return <div>خطا در دریافت</div>;
  }
};

// IndexedDB removed - using backend API via cartService

export default ProductCard;
