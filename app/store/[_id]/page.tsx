"use client";
import React, { useEffect, useState } from "react";
import { DetailPageSection, ProductCardData, ProductImage } from "@/lib/types";
import Image from "next/image";
import { styled } from "styled-components";
import dataLg from "../../../public/template/detaillg.json";
import dataSm from "../../../public/template/blogDetailSm.json";
import { useParams } from "next/navigation";


const SectionDetailPage = styled.div<{
  $data: DetailPageSection;
}>`
  padding-top: ${(props) => props.$data?.setting?.paddingTop || 0}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom || 0}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop || 0}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || 0}px;
  background-color: ${(props) =>
    props.$data?.setting?.backgroundColor || "#ffffff"};

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
    color: ${(props) => props.$data?.setting?.btnTextColor || "#FFFFFF"};
    transition: transform 0.5s ease;
    &:hover {
      transform: translateY(-2px);
      opacity: 0.85;
      transition: transform 0.3s ease-in-out;
    }
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
    const openRequest = indexedDB.deleteDatabase('CartDB');
    openRequest.onsuccess = () => {
      const request = indexedDB.open('CartDB', 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore('cart', { keyPath: 'id' });
      };

      request.onsuccess = () => resolve(request.result);
    };
  });
};

// Update the checkCartStatus function
const checkCartStatus = async () => {
  const db = await initializeDB();
  if (product?._id) {
    const transaction = (db as IDBDatabase).transaction('cart', 'readonly');
    const store = transaction.objectStore('cart');
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
  const request = indexedDB.open('CartDB', 1);
  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction('cart', 'readwrite');
    const store = transaction.objectStore('cart');
    
    if (newQuantity <= 0) {
      if (product?._id) {
        store.delete(product._id);
      }
      setIsInCart(false);
      setQuantity(0);
    } else {
      const cartItem = {
        id: product?._id || '',
        name: product?.name,
        price: product?.price,
        quantity: newQuantity,
        image: product?.images?.[0]?.imageSrc || '/assets/images/pro1.jpg'
      };
      store.put(cartItem);
      setQuantity(newQuantity);
    }
  };
};
  const addToCart = async (product: ProductCardData) => {
    const dbName = 'CartDB';
    const storeName = 'cart';
    const version = 1;
  
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);
  
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        
        const cartItem = {
          id: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.images?.[0]?.imageSrc || '/assets/images/pro1.jpg'
        };
  
        store.put(cartItem);
        resolve(cartItem);
      };
  
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore(storeName, { keyPath: 'id' });
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
      className={` mx-2 rounded-lg px-4 py-8 transition-all duration-150 ease-in-out relative`}
      dir="rtl"
    >
      <div className="grid grid-cols-1 mt-32 md:grid-cols-2 gap-12 lg:gap-48">
        {/* Product Images Section */}
        <div className="space-y-4">
          <div className="product-image">
            <Image
              src={selectedImage || "/assets/images/pro1.jpg"}
              alt={product.name}
              width={1000}
              height={1000}
            />
          </div>
          <div className="flex gap-4 overflow-x-auto">
            {Array.isArray(product.images) &&
              product.images.map((image: ProductImage, index: number) => (
                <div
                  key={index}
                  className={`relative h-20 w-20 cursor-pointer rounded-md overflow-hidden ${
                    selectedImage === image.imageSrc
                      ? "border-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => setSelectedImage(image.imageSrc)}
                >
                  <Image
                    src={image.imageSrc || "/assets/images/pro3.jpg"}
                    alt={image.imageAlt}
                    fill
                    className="object-cover "
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-description">{product.description}</p>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="product-price">{product.price} تومان</span>
              {product.discount && (
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full">
                  {product.discount}% تخفیف
                </span>
              )}
            </div>

            <div className="space-y-2">
              {product.status && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold product-status">وضعیت:</span>
                  <span
                    className={`${
                      product.status === "available"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.status === "available" ? "موجود" : "ناموجود"}
                  </span>
                </div>
              )}

              {product.category && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold product-category">
                    دسته‌بندی:
                  </span>
                  <span className="product-category">{product.category?.name}</span>
                  </div>
              )}
            </div>
            <div className="flex  gap-2">
            {!isInCart ? (
  <button 
    className="px-6 py-3 add-to-cart-button rounded-md"
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
          </div>
        </div>
      </div>
    </SectionDetailPage>
  );
};
export default DetailPage;
