"use client";
import React, { useEffect, useState } from "react";
import { DetailPageSection, ProductCardData, ProductImage } from "@/lib/types";
import Image from "next/image";
import { styled } from "styled-components";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { cartService } from "@/lib/cartService";



interface ProductColor {
  code: string;
  quantity: string;
  _id?: string;
}

interface ProductProperty {
  name: string;
  value: string;
  _id?: string;
}

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
  position: relative;
  padding-top: ${(props) => props.$data?.setting?.paddingTop}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight}px;
  margin-top: ${(props) => props.$data?.setting?.paddingRight}px;
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
    color: ${(props) => props.$data?.setting?.propertyKeyColor || "#000000"};
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
      height: 250px;
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
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const componentName = "DetailPage";
  const router = useRouter();

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
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedProperties, setSelectedProperties] = useState<{
    [key: string]: string;
  }>({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const params = useParams();
  const productId = params.id as string;

  const fetchLayoutData = async (routeName: string, activeMode: string) => {
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
      console.log("Error fetching layout data:", error);
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
          // Set default color if available
          if (productData.colors && productData.colors.length > 0) {
            setSelectedColor(productData.colors[0].code);
          }
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
        در حال بارگذاری
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        محصول یافت نشد
      </div>
    );
  }
  // Create fallback section data if layout data is not available
  const sectionData =
    data &&
    (data as Record<string, unknown>).sections &&
    ((data as Record<string, unknown>).sections as Record<string, unknown>)
      .children &&
    (
      ((data as Record<string, unknown>).sections as Record<string, unknown>)
        .children as Record<string, unknown>
    ).sections
      ? (
          (
            (
              (data as Record<string, unknown>).sections as Record<
                string,
                unknown
              >
            ).children as Record<string, unknown>
          ).sections as Record<string, unknown>[]
        )?.find(
          (section: Record<string, unknown>) => section.type === componentName
        )
      : null;

  const addToCart = async () => {
    // Check if user has token
    const token = localStorage.getItem("tokenUser");
    if (!token) {
      toast.error("برای افزودن به سبد خرید ابتدا وارد شوید");
      router.push("/login");
      return;
    }

    // Validate color selection
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error("لطفاً رنگ مورد نظر را انتخاب کنید");
      return;
    }

    setIsAddingToCart(true);

    try {
      const productId = product.id || product._id;

      if (!productId) {
        toast.error("خطا در شناسایی محصول");
        return;
      }

      // Calculate final price with discount
      const originalPrice = parseFloat(product.price?.replace(/[^0-9.-]+/g, "") || "0");
      const finalPrice = product.discount && Number(product.discount) > 0 
        ? originalPrice * (1 - Number(product.discount) / 100)
        : originalPrice;

      const cartItem = {
        productId: productId,
        name: product.name || "Unnamed Product",
        price: finalPrice,
        quantity: 1,
        image: selectedImage || "/assets/images/pro2.jpg",
        colorCode: selectedColor,
        properties: Object.entries(selectedProperties).map(([name, value]) => ({
          name,
          value,
        })),
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

  if (layoutLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        در حال بارگذاری
      </div>
    );
  }

  return (
    <SectionDetailPage
      $isMobile={isMobile}
      $data={
        (sectionData as unknown as DetailPageSection) ||
        ({} as unknown as DetailPageSection)
      }
      dir="rtl"
    >
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
              className={`flex gap-1 py-2 px-1 overflow-x-auto ${
                isMobile ? "min-w-full" : " overflow-x-auto"
              }`}
            >
              {Array.isArray(product.images) && product.images.length > 0
                ? product.images
                    .slice(0, isMobile ? product.images.length : 3)
                    .map((image: ProductImage, index: number) => (
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
                : null}
              {!isMobile &&
                Array.isArray(product.images) &&
                product.images.length > 3 && (
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="min-w-[80px] h-[80px] bg-gray-100 border border-gray-300 rounded-lg flex flex-col items-center justify-center text-xs text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                     <span>مشاهده همه</span>
                  </button>
                )}
              {(!Array.isArray(product.images) ||
                product.images.length === 0) &&
                // Default static images
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
        <div className={`space-y-8 lg:-mr-72 ${isMobile ? " " : ""}`}>
          <h1 className="product-name">{product.name || "نام محصول"}</h1>
          <p className="product-description max-w-xl text-wrap">
            {product.description ||
              "توضیحات محصول در ابن قسمت نمایش داده می شود."}
          </p>

          {/* Colors Section */}
          {product.colors && product.colors.length > 0 && (
            <div className="max-w-sm rounded-lg p-4 relative z-50">
              <div className="text-sm font-bold mb-3">انتخاب رنگ</div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color: ProductColor, index: number) => {
                  const isAvailable = Number(color.quantity) > 0;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color.code)}
                      disabled={!isAvailable}
                      className={`w-10 h-10 rounded-full border-2 transition-all relative ${
                        selectedColor === color.code
                          ? "border-blue-500 scale-110 ring-2 ring-blue-200"
                          : "border-gray-300"
                      } ${
                        !isAvailable
                          ? "opacity-30 cursor-not-allowed"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.code }}
                      title={`رنگ ${color.code} - موجودی: ${color.quantity}`}
                    >
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-0.5 bg-red-500 rotate-45"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Properties Section */}
          {Array.isArray(product.properties) &&
            product.properties.length > 0 && (
              <div className="max-w-sm rounded-lg p-4 relative z-50">
                <div className="text-sm font-bold mb-3">انتخاب ویژگی‌ها</div>
                <div className="grid grid-cols-3 gap-1">
                  {product.properties.map(
                    (prop: ProductProperty, index: number) => {
                      const isSelected =
                        selectedProperties[prop.name] === prop.value;
                      return (
                        <button
                          key={index}
                          onClick={() =>
                            setSelectedProperties((prev) => ({
                              ...prev,
                              [prop.name]: prop.value,
                            }))
                          }
                          className={`w-full text-right px-3 py-2 border rounded-lg text-sm transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">{prop.name}</span>
                            <span className="font-medium">{prop.value}</span>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          <div className=" max-w-xl rounded-lg p-4 ">
            <div className="text-sm font-bold mb-3">ویژگی‌های محصول</div>
            <div className=" flex flex-wrap gap-2">
              {(Array.isArray(product.properties) &&
              product.properties.length > 0
                ? product.properties
                : defaultProperties
              ).map((prop, index) => (
                <div
                  key={index}
                  className="flex  p-2 rounded-lg group relative property-bg"
                >
                  <span className="  text-sm ml-2 property-key">
                    {prop.name}:
                  </span>
                  <span className="text-sm property-value">{prop.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className={` ${
              isMobile
                ? "   "
                : "lg:absolute lg:left-8 lg:-top-2 lg:w-[300px] lg:z-10 lg:pointer-events-none"
            } `}
          >
            <div className="bg-white bg-box rounded-xl shadow-lg p-6 space-y-3 lg:pointer-events-auto">
              {/* Price and Discount Section */}
              <div className="flex flex-col gap-2">
                {product.discount && Number(product.discount) > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="product-price text-xl font-bold text-green-600">
                        {(
                          Number(product.price) *
                          (1 - Number(product.discount) / 100)
                        ).toLocaleString("fa-IR")}{" "}
                        تومان
                      </span>
                      <span className="bg-red-100 text-red-600 px-3 text-nowrap py-1 rounded-full text-sm">
                        {Number(product.discount).toLocaleString("fa-IR")}% تخفیف
                      </span>
                    </div>
                    <span className="text-red-400 line-through text-sm">
                      {Number(product.price).toLocaleString("fa-IR")} تومان
                    </span>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="product-price text-xl font-bold">
                      {Number(product.price).toLocaleString("fa-IR") ||
                        "80,000"}{" "}
                      تومان
                    </span>
                  </div>
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
                    product.status === "available"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span className=" product-status">
                  {product.status === "available"
                    ? "موجود در انبار"
                    : "ناموجود"}
                </span>
              </div>

              {/* Selected Options Display */}
              {(selectedColor ||
                Object.keys(selectedProperties).length > 0) && (
                <div className="space-y-2 text-sm border-t pt-3">
                  <div className="font-medium">انتخاب شما:</div>
                  {selectedColor && (
                    <div className="flex items-center gap-2">
                      <span>رنگ:</span>
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: selectedColor }}
                      />
                      <span>{selectedColor}</span>
                    </div>
                  )}
                  {Object.entries(selectedProperties).map(([name, value]) => (
                    <div key={name} className="flex justify-between">
                      <span>{name}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={addToCart}
                  disabled={
                    isAddingToCart ||
                    (product.colors &&
                      product.colors.length > 0 &&
                      !selectedColor)
                  }
                  className="w-full px-6 py-3 add-to-cart-button rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? "در حال افزودن..." : "افزودن به سبد خرید"}
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

      {/* Image Modal Slider */}
      {showImageModal && Array.isArray(product.images) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999]"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative w-full max-w-4xl h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Main Image */}
            <div className="relative w-full h-[70vh] mx-16">
              <Image
                src={product.images[modalImageIndex]?.imageSrc || ""}
                alt={product.images[modalImageIndex]?.imageAlt || ""}
                fill
                className="object-contain"
              />
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={() =>
                setModalImageIndex((prev) =>
                  prev > 0 ? prev - 1 : product.images.length - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={() =>
                setModalImageIndex((prev) =>
                  prev < product.images.length - 1 ? prev + 1 : 0
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {modalImageIndex + 1} / {product.images.length}
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-md overflow-x-auto">
              {product.images.map((image: ProductImage, index: number) => (
                <button
                  key={index}
                  onClick={() => setModalImageIndex(index)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    modalImageIndex === index
                      ? "border-white"
                      : "border-transparent opacity-60"
                  }`}
                >
                  <Image
                    src={image.imageSrc}
                    alt={image.imageAlt}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </SectionDetailPage>
  );
}
