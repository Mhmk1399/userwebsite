"use client";
import React, { useEffect, useState } from "react";
import { DetailPageSection, ProductCardData, ProductImage } from "@/lib/types";
import Image from "next/image";
import { styled } from "styled-components";
import { useParams } from "next/navigation";

const defaultProperties = [
  { key: "نوع اتصال", value: "بی‌سیم", tooltip: "بی‌سیم " },
  { key: "نوع گوشی", value: "دو گوشی", tooltip: "دو گوشی" },
  { key: "قابلیت‌های ویژه", value: "میکروفون", tooltip: "میکروفون" },
  { key: "مناسب برای", value: "بازی، مکالمه", tooltip: "بازی، مکالمه" },
  { key: "رابط", value: "بلوتوث", tooltip: "بلوتوث" },
];
const SectionDetailPage = styled.div<{
  $data: DetailPageSection;
  $isMobile: boolean;
}>`
  max-width: 100%;
  padding-top: ${(props) => props.$data?.setting?.paddingTop}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom}px;
  margin-left: ${(props) => props.$data?.setting?.marginLeft}px;
  margin-right: ${(props) => props.$data?.setting?.marginRight}px;
  background-color: ${(props) =>
    props.$data?.setting?.backgroundColor || "#ffffff"};
  box-shadow: ${(props) =>
    `
    ${props.$data?.setting?.shadowOffsetX || 0}px 
     ${props.$data?.setting?.shadowOffsetY || 4}px 
     ${props.$data?.setting?.shadowBlur || 10}px 
     ${props.$data?.setting?.shadowSpread || 0}px 
     ${props.$data?.setting?.shadowColor || "#fff"}`};
  border-radius: ${(props) => props.$data?.setting?.Radius || "10"}px;

  .product-name {
    color: ${(props) => props.$data?.setting?.productNameColor || "#000000"};
    font-size: ${(props) => props.$data?.setting?.productNameFontSize || 20}px;
    font-weight: ${(props) =>
      props.$data?.setting?.productNameFontWeight || "bold"};
  }
  .product-category {
    color: ${(props) => props.$data?.setting?.categoryColor || "#000000"};
    font-size: ${(props) => props.$data?.setting?.categoryFontSize || 20}px;
  }

  .product-price {
    color: ${(props) => props.$data?.setting?.priceColor || "#000000"};
    font-size: ${(props) => props.$data?.setting?.priceFontSize || 12}px;
    @media (max-width: 768px) {
      font-size: 30px;
    }
  }

  .product-description {
    color: ${(props) => props.$data?.setting?.descriptionColor || "#000000"};
    font-size: ${(props) => props.$data?.setting?.descriptionFontSize || 16}px;
    font-weight: ${(props) =>
      props.$data?.setting?.descriptionFontWeight || "bold"};
    @media (max-width: 768px) {
      font-size: 20px;
    }
  }
  .product-status {
    color: ${(props) => props.$data?.setting?.statusColor || "#000000"};
    font-size: ${(props) => props.$data?.setting?.statusFontSize || 10}px;
    @media (max-width: 768px) {
      font-size: 20px;
    }
  }

  .add-to-cart-button {
    background-color: ${(props) =>
      props.$data?.setting?.btnBackgroundColor || "#3498DB"};
    color: ${(props) => props.$data?.setting?.btnTextColor || "#000000"};
    border-radius: ${(props) => props.$data?.setting?.btnRadius || 10}px;
    transition: transform 0.5s ease;
    &:hover {
      transform: translateY(-2px);
      opacity: 0.85;
      transition: transform 0.3s ease-in-out;
    }
  }
  .bg-box {
    background-color: ${(props) =>
      props.$data?.setting?.backgroundColorBox || "#ffffff"};
    border-radius: ${(props) => props.$data?.setting?.boxRadius || 10}px;
  }
  .property-key {
    color: ${(props) => props.$data?.setting?.propertyKeyColor || "#e4e4e4"};
  }
  .property-value {
    color: ${(props) => props.$data?.setting?.propertyValueColor || "#000000"};
  }
  .property-bg {
    background-color: ${(props) =>
      props.$data?.setting?.propertyBg || "#ffffff"};
    border-radius: ${(props) => props.$data?.setting?.propertyRadius || 10}px;
  }

  .product-image {
    width: 375px;
    height: 250px;
    border-radius: ${(props) => props.$data?.setting?.imageRadius || 2}px;
    object-fit: cover;
    overflow: hidden;
    position: relative;

    @media (max-width: 768px) {
      width: 100%;
      height: auto;
    }

    img {
      width: 100%;
      height: 100%;
      transition: transform 0.4s ease-in-out;

      &:hover {
        transform: scale(1.7);
        cursor: zoom-in;
      }
    }
  }
`;

export default function DetailPage() {
  const [isMobile, setIsMobile] = useState(false);
  const componentName = "DetailPage";
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [product, setProduct] = useState<ProductCardData>({
    images: [],
    name: "",
    description: "",
    price: "80,000",
    id: "",
    category: { name: "headphone", _id: "1" },
    discount: "20",
    status: "eded",
    inventory: "",
    colors: [],
    properties: "",
    createdAt: "",
    updatedAt: "",
  });

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [layoutLoading, setLayoutLoading] = useState<boolean>(true);

  const params = useParams();
  const productId = params.id as string;

  const fetchLayoutData = async (
    routeName: string,
    activeMode: string
  ) => {
    try {
      const response = await fetch("/api/layout-jason", {
        method: "GET",
        headers: {
          selectedRoute: "detail",
          activeMode: activeMode,
        },
      });

      if (!response.ok) {
        console.log(`Failed to fetch layout data: ${response.status}`);
      }

      const layoutData = await response.json();
      setData(layoutData);
      console.log(layoutData);
      setLayoutLoading(false);
      // Extract header and footer data
      // if (layoutData.sections?.sectionHeader) {
      //   setHeaderData(layoutData.sections.sectionHeader);
      // }
      // console.log(headerData);

      // if (layoutData.sections?.sectionFooter) {
      //   setFooterData(layoutData.sections.sectionFooter);
      // }
      return layoutData;
    } catch (error) {
      console.error("Error fetching layout data:", error);
      setLayoutLoading(false);
    }
  };

  useEffect(() => {
    fetchLayoutData("lg", "detail");
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/store/${productId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const productData = await response.json();
        console.log(productData, ".....");

        if (productData && productData.images) {
          setProduct(productData);
          setSelectedImage(productData?.images[0]?.imageSrc || "");
        }
      } catch (error) {
        console.log("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        Product not found
      </div>
    );
  }
  // Create fallback section data if layout data is not available
  const sectionData = data && (data as Record<string, unknown>).sections && 
    ((data as Record<string, unknown>).sections as Record<string, unknown>).children &&
    (((data as Record<string, unknown>).sections as Record<string, unknown>).children as Record<string, unknown>).sections ?
    ((((data as Record<string, unknown>).sections as Record<string, unknown>).children as Record<string, unknown>).sections as Record<string, unknown>[])?.find(
      (section: Record<string, unknown>) => section.type === componentName
    ) : null;

  if (layoutLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading layout...
      </div>
    );
  }

  return (
    <SectionDetailPage $isMobile={isMobile} $data={(sectionData as unknown as DetailPageSection) || ({} as unknown as DetailPageSection)} dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-2">
        {/* Product Images Section */}
        <div className="space-y-4 z-50">
          <div className="product-image">
            <Image
              src={selectedImage || "/assets/images/pro2.jpg"}
              alt={product.name}
              width={2000}
              height={1000}
              className="transition-transform duration-300 ease-in-out hover:scale-150"
            />
          </div>

          <div className="relative">
            <div
              className={`flex gap-3 py-2  ${
                isMobile ? "min-w-full" : " overflow-x-auto"
              }`}
            >
              {Array.isArray(product.images) && product.images.length > 0
                ? product.images.map((image: ProductImage, index: number) => (
                    <div
                      key={index}
                      className={`relative min-w-[80px] h-[80px] cursor-pointer 
              transition-all duration-300 ease-in-out hover:shadow-lg 
              ${
                selectedImage === image.imageSrc
                  ? "border-2 border-blue-500 scale-105"
                  : "border border-gray-200"
              }
              rounded-lg overflow-hidden`}
                      onClick={() => setSelectedImage(image.imageSrc)}
                    >
                      <Image
                        src={image.imageSrc}
                        alt={image.imageAlt}
                        fill
                        className="object-cover hover:opacity-90"
                      />
                    </div>
                  ))
                : // Default static images
                  [
                    "/assets/images/pro1.jpg",
                    "/assets/images/pro2.jpg",
                    "/assets/images/pro3.jpg",
                  ].map((defaultImage, index) => (
                    <div
                      key={index}
                      className={`relative min-w-[94px] h-[80px] cursor-pointer 
              transition-all duration-300 ease-in-out hover:shadow-lg
              ${
                selectedImage === defaultImage
                  ? "border-2 border-blue-500 scale-105"
                  : "border border-gray-200"
              }
              rounded-lg overflow-hidden`}
                      onClick={() => setSelectedImage(defaultImage)}
                    >
                      <Image
                        src={defaultImage}
                        alt={`Default product image ${index + 1}`}
                        fill
                        className="object-cover hover:opacity-90"
                      />
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Product Info Section */}
        <div className={`space-y-8 lg:-mr-64 ${isMobile ? "mt-96 pr-16" : ""}`}>
          <h1 className="product-name">{product.name || "نام محصول"}</h1>
          <p className="product-description text-wrap">
            {product.description ||
              "توضیحات محصول در ابن قسمت نمایش داده می شود."}
          </p>
          <div className=" max-w-sm rounded-lg p-4 ">
            <div className="text-sm font-bold mb-3">ویژگی‌های محصول</div>
            <div className=" flex flex-wrap gap-2">
              {(Array.isArray(product.properties) &&
              product.properties.length > 0
                ? product.properties
                : defaultProperties
              ).map((prop, index) => (
                <div
                  key={index}
                  className="flex flex-col p-2 rounded-lg group relative property-bg"
                >
                  <span className="text-gray-500 text-sm ml-2 property-key">
                    {prop.key}:
                  </span>
                  <span className="text-sm property-value">{prop.value}</span>
                  <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 -top-8 right-0 whitespace-nowrap">
                    {prop.tooltip}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={` ${
              isMobile ? "   " : "lg:absolute lg:left-8 lg:-top-2 lg:w-[300px]"
            } `}
          >
            <div className="bg-white bg-box rounded-xl shadow-lg p-6 space-y-3">
              {/* Price and Discount Section */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="product-price text-xl font-bold">
                    {product.price || "80,000"} تومان
                  </span>
                  {product.discount && (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                      {product.discount}% تخفیف
                    </span>
                  )}
                </div>
                {product.discount && (
                  <span className="text-red-300 line-through text-sm">
                    {(
                      Number(product.price?.replace(/,/g, "")) /
                      (1 - Number(product.discount) / 100)
                    ).toLocaleString()}{" "}
                    تومان
                  </span>
                )}
              </div>

              {/* Delivery Info */}
              <div className="space-y-3 border-t border-b py-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm">ارسال سریع</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm">تحویل در سریع‌ترین زمان ممکن</span>
                </div>
              </div>

              {/* Inventory Status */}
              <div className="flex items-center product-status gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    product.inventory && Number(product.inventory) > 0
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span className=" product-status">
                  {product.inventory && Number(product.inventory) > 0
                    ? "موجود در انبار"
                    : "ناموجود"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full px-6 py-3 add-to-cart-button rounded-lg font-medium">
                  افزودن به سبد خرید
                </button>
              </div>

              {/* Additional Product Info */}
              <div className="text-sm space-y-2 text-gray-600">
                <div className="flex product-category justify-between">
                  <span>دسته‌بندی:</span>
                  <span>{product.category?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionDetailPage>
  );
}
