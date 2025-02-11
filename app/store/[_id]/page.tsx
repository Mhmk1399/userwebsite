"use client";
import React, { useEffect, useState } from "react";
import { DetailPageSection, ProductCardData, ProductImage } from "@/lib/types";
import Image from "next/image";
import { styled } from "styled-components";
import dataLg from "../../../public/template/detaillg.json";
import dataSm from "../../../public/template/detailsm.json";
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
}>`
  padding-top: ${(props) => props.$data?.setting?.paddingTop || 0}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom || 0}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft || 20}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight || 20}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop || 0}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || 0}px;
  background-color: ${(props) =>
    props.$data?.setting?.backgroundColor || "#ffffff"};
  height: full;

  .product-name {
    color: ${(props) => props.$data?.setting?.productNameColor || "#fff"};
    font-size: ${(props) => props.$data?.setting?.productNameFontSize || 20}px;
    font-weight: ${(props) =>
      props.$data?.setting?.productNameFontWeight || "bold"};
  }
  .product-category {
    color: ${(props) => props.$data?.setting?.categoryColor || "#000000"};
    font-size: ${(props) => props.$data?.setting?.categoryFontSize || 20}px;
  }

  .product-price {
    color: ${(props) => props.$data?.setting?.priceColor || "#fff"};
    font-size: ${(props) => props.$data?.setting?.priceFontSize || 12}px;
    @media (max-width: 768px) {
      font-size: 30px;
    }
  }

  .product-description {
    color: ${(props) => props.$data?.setting?.descriptionColor || "#000000"};
    font-size: ${(props) => props.$data?.setting?.descriptionFontSize || 16}px;
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
  }

  .product-image {
    width: ${(props) => props.$data?.setting?.imageWidth || 300}px;
    height: ${(props) => props.$data?.setting?.imageHeight || 200}px;
    border-radius: ${(props) => props.$data?.setting?.imageRadius || 10}px;
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

const DetailPage = () => {
  const [product, setProduct] = useState<ProductCardData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sectionData, setSectionData] = useState<DetailPageSection | null>(
    null
  );
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(0);
  useEffect(() => {
    // Initialize database and store
    const initializeDB = () => {
      return new Promise((resolve) => {
        const openRequest = indexedDB.deleteDatabase("CartDB");
        openRequest.onsuccess = () => {
          const request = indexedDB.open("CartDB", 1);

          request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            db.createObjectStore("cart", { keyPath: "id" });
          };

          request.onsuccess = () => resolve(request.result);
        };
      });
    };

    // Update the checkCartStatus function
    const checkCartStatus = async () => {
      const db = await initializeDB();
      if (product?._id) {
        const transaction = (db as IDBDatabase).transaction("cart", "readonly");
        const store = transaction.objectStore("cart");
        const getRequest = store.get(product._id);

        getRequest.onsuccess = () => {
          if (getRequest.result) {
            setIsInCart(true);
            setQuantity(getRequest.result.quantity);
          }
        };
      }
    };

    if (product?._id) {
      checkCartStatus();
    }
  }, [product?._id]);
  const updateQuantity = async (newQuantity: number) => {
    const request = indexedDB.open("CartDB", 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("cart", "readwrite");
      const store = transaction.objectStore("cart");

      if (newQuantity <= 0) {
        if (product?._id) {
          store.delete(product._id);
        }
        setIsInCart(false);
        setQuantity(0);
      } else {
        const cartItem = {
          id: product?._id || "",
          name: product?.name,
          price: product?.price,
          quantity: newQuantity,
          image: product?.images?.[0]?.imageSrc || "/assets/images/pro1.jpg",
        };
        store.put(cartItem);
        setQuantity(newQuantity);
      }
    };
  };
  const addToCart = async (product: ProductCardData) => {
    const dbName = "CartDB";
    const storeName = "cart";
    const version = 1;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        const cartItem = {
          id: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.images?.[0]?.imageSrc || "/assets/images/pro1.jpg",
        };

        store.put(cartItem);
        resolve(cartItem);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore(storeName, { keyPath: "id" });
      };
    });
  };
  const params = useParams();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/store/${params._id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        console.log(data, "deeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    if (params._id) {
      fetchProductDetails();
    }
  }, [params._id]);
  useEffect(() => {
    // Determine which data to use based on screen width
    const handleResize = () => {
      const data = window.innerWidth < 768 ? dataSm : dataLg;
      setSectionData(data.children.sections[0] as unknown as DetailPageSection);
    };

    // Initial setup
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  if (loading || !sectionData) {
    return <div>Loading...</div>;
  }

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

  return (
    <SectionDetailPage
      $data={sectionData}
      className={` mx-2 rounded-lg px-4 min-h-fit py-8 transition-all duration-150 ease-in-out relative `}
      dir="rtl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-2">
        {/* Product Images Section */}
        <div className="space-y-4 z-50">
          <div className="product-image">
            <Image
              src={selectedImage || "/assets/images/pro2.jpg"}
              alt={product.name}
              width={1000}
              height={1000}
              className="transition-transform duration-300 ease-in-out hover:scale-150"
            />
          </div>

          <div className="relative">
            <div className={`flex gap-3 py-2 overflow-x-auto`}>
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
                      className={`relative min-w-[120px] h-[80px] cursor-pointer 
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
        <div className={`space-y-8 lg:-mr-64`}>
          <h1 className="product-name">{product.name}</h1>
          <p className="product-description text-wrap">{product.description}</p>
          <div className=" max-w-sm rounded-lg p-4 mt-4">
            <div className="text-sm font-bold mb-3">رنگ‌های موجود</div>
            <div className="flex flex-wrap gap-3">
              {product.colors?.map((color, index) => (
                <div key={index} className="relative group">
                  <div
                    className="w-10 h-10 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 border-gray-200"
                    style={{ backgroundColor: color.code }}
                    title={`موجودی: ${color.quantity} عدد`}
                  />
                  <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap transition-opacity">
                    موجودی: {color.quantity} عدد
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-xs">
                    {color.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-gray-300 max-w-sm rounded-lg p-4 ">
            <div className="text-sm font-bold mb-3">ویژگی‌های محصول</div>
            <div className=" flex flex-wrap gap-2">
              {(Array.isArray(product.properties) &&
              product.properties.length > 0
                ? product.properties
                : defaultProperties
              ).map((prop, index) => (
                <div
                  key={index}
                  className="flex flex-row p-2 rounded-lg group relative property-bg"
                >
                  <span className="text-gray-500 text-sm ml-2 property-key">
                    {prop.name}:
                  </span>
                  <span className="text-sm property-value">{prop.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`lg:absolute lg:left-8 lg:-top-2 lg:w-[300px]`}>
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
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    product.status === "available"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm">
                  {product.status === "available"
                    ? "موجود در انبار"
                    : "ناموجود"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex  gap-2">
                {!isInCart ? (
                  <button
                    className="px-4 py-2 add-to-cart-button rounded-md"
                    onClick={async () => {
                      await addToCart(product);
                      setIsInCart(true);
                      setQuantity(1);
                    }}
                  >
                    افزودن به سبد خرید
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      className="px-4 py-2 add-to-cart-button rounded-md"
                      onClick={() => updateQuantity(quantity + 1)}
                    >
                      +
                    </button>
                    <span className="text-xl">{quantity}</span>
                    <button
                      className="px-4 py-2 add-to-cart-button rounded-md"
                      onClick={() => updateQuantity(quantity - 1)}
                    >
                      -
                    </button>
                  </div>
                )}
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
};
export default DetailPage;
