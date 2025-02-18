"use client";
import styled from "styled-components";
import { ProductSection, ProductCardData } from "@/lib/types";
import ProductCard from "./productCard";
import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { FiFilter } from "react-icons/fi";

interface ProductListProps {
  sections: ProductSection[];
  isMobile: boolean;
  componentName: string;
}
interface CategoryWithChildren {
  _id: string;
  name: string;
  children?: CategoryWithChildren[];
}
interface ColorBoxProps {
  $color: string;
  $selected: boolean;
}

const FilterBgRow = styled.div<{ $data: ProductSection }>`
  background-color: ${(props) =>
    props.$data?.setting?.filterCardBg || "#f3f4f6"};
  position: absolute;
  min-width: 100%;
  top: px;
  right: 0;
  z-index: 20;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  direction: rtl;
`;

const FilteNameRow = styled.div<{ $data: ProductSection }>`
  color: ${(props) => props.$data?.setting?.textColor};
  padding-top: 1px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight}px;
`;

const FilterCardBg = styled.div<{ $data: ProductSection }>`
  background-color: ${(props) =>
    props.$data?.setting?.filterCardBg || "#f3f4f6"};
  border-radius: 10px;
  height: fit-content;
  box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.1);
  margin-top: 7rem;

  width: 280px;

  @media (max-width: 426px) {
    display: none;
  }
`;

const FilterBtn = styled.div<{ $data: ProductSection }>`
  background-color: ${(props) =>
    props.$data?.setting?.btnBackgroundColor || "#2563eb"};
  color: ${(props) => props.$data?.setting?.btnTextColor || "white"};
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-align: center;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const ColorBox = styled.div<ColorBoxProps>`
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background-color: ${(props) => props.$color};
  cursor: pointer;
  border: 2px solid ${(props) => (props.$selected ? "#2563eb" : "transparent")};
  transition: all 0.2s ease;
  &:hover {
    transform: scale(1.1);
  }
`;

const RangeSliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
`;

const RangeSlider = styled.input`
  position: absolute;
  width: 100%;
  pointer-events: none;
  appearance: none;
  height: 7px;
  background: #ddd;
  border-radius: 5px;
  background-image: linear-gradient(#3b82f6, #3b82f6);
  background-repeat: no-repeat;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    box-shadow: 0 0 2px 0 #555;
    pointer-events: all;
  }

  &::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
  }
`;

const SectionProductList = styled.section<{
  $data: ProductSection;
  $previewWidth: "sm" | "default";
  $isMobile: boolean;
}>`
  display: flex;
  flex-wrap: wrap;
  overflow-x: auto;
  width: 78%;
  direction: ltr;
  padding-top: ${(props) => props.$data?.setting?.paddingTop}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom}px;
  background-color: #ffffff;

  ${(props) =>
    props.$previewWidth === "default" &&
    `
    display: grid;
    grid-template-columns: repeat(${props.$data.setting?.gridColumns}, 1fr);
    overflow-x: auto;
  `}

  @media (max-width: 426px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    justify-content: center;
    width: 100%;
  }
`;

const ProductList: React.FC<ProductListProps> = ({
  sections,
  isMobile,
  componentName,
}) => {
  const [productData, setProductData] = useState<ProductCardData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductCardData[]>(
    []
  );
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [sortBy, setSortBy] = useState<
    "newest" | "price-asc" | "price-desc" | "name"
  >("newest");
  const [colors, setColors] = useState<string[]>([]);
  const [showColorModal, setShowColorModal] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const sortOptions = [
    { value: "newest", label: "جدیدترین" },
    { value: "price-asc", label: "ارزان‌ترین" },
    { value: "price-desc", label: "گران‌ترین" },
    { value: "name", label: "نام محصول" },
  ];
  const pathname = usePathname();
  console.log(pathname.split("/")[2]);
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    priceMin: 1000,
    priceMax: 1000000000,
  });
  const getSortedProducts = (products: ProductCardData[]) => {
    switch (sortBy) {
      case "newest":
        return [...products].sort(
          (a, b) =>
            new Date(b?.createdAt || 0).getTime() -
            new Date(a?.createdAt || 0).getTime()
        );
      case "price-asc":
        return [...products].sort(
          (a, b) => parseInt(a.price) - parseInt(b.price)
        );
      case "price-desc":
        return [...products].sort(
          (a, b) => parseInt(b.price) - parseInt(a.price)
        );
      case "name":
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return products;
    }
  };

  const handleFilter = useCallback(() => {
    let filtered = [...productData];
  
    // Category filter
    if (selectedFilters.category) {
      filtered = filtered.filter(
        (product) => product.category?.name === selectedFilters.category
      );
    }
  
    // Color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) =>
        product.colors?.some((color) => selectedColors.includes(color.code))
      );
    }
  
    // Price filter
    filtered = filtered.filter((product) => {
      const price = parseInt(product.price);
      return price >= selectedFilters.priceMin && price <= selectedFilters.priceMax;
    });
  
    // Apply current sorting
    const sortedFiltered = getSortedProducts(filtered);
  
    setFilteredProducts(sortedFiltered);
  }, [productData, selectedColors, selectedFilters, sortBy]);
  
  const searchParams = useSearchParams();
  const urlString = searchParams.toString();
  const categoryParam = decodeURIComponent(urlString.split("=")[1]?.replace(/\+/g, " "));
console.log("categoryParam", categoryParam);

  const getCollection = async () => {
    const collectionId = pathname.split("/").pop();
    const response = await fetch(`/api/collection/${collectionId}`, {
      cache: "no-store",
    });
    const data = await response.json();
    setProductData(data.products);
  };
  useEffect(() => {
    if (pathname.split("/")[1] === "store") {
      fetchProducts();
    } else {
      getCollection();
    }
  }, [categoryParam]);

 useEffect(() => {
  const loadInitialData = async () => {
    const isStoreRoute = pathname.split("/")[1] === "store";
    if (isStoreRoute) {
      await fetchProducts();
      setFilteredProducts(productData); // Initialize filtered products
    } else {
      await getCollection();
      setFilteredProducts(productData); // Initialize filtered products
    }
  };

  loadInitialData();
}, [pathname]);


  useEffect(() => {
    if (productData.length > 0) {
      const prices = productData.map((product) => parseInt(product.price));
      setPriceRange({
        min: Math.min(...prices),
        max: Math.max(...prices),
      });
    }
  }, [productData]);
  useEffect(() => {
    if (productData.length > 0) {
      const allColors = [
        ...new Set(
          productData.flatMap((product) =>
            (product.colors || []).map((color) => color.code)
          )
        ),
      ];
      setColors(allColors);
    }
  }, [productData]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("/api/category");
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
   

        const response = await fetch("/api/store");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data?.products) {
        setProductData(data.products);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Empty dependency array for initial load only
  useEffect(() => {
    if (productData.length > 0) {
      handleFilter();
    }
  }, [selectedFilters, sortBy, productData.length, handleFilter]); // Only re-run when filters or sort changes

  
  const sectionData = sections.find(
    (section) => section.type === componentName
  );

  if (!sectionData) {
    return <div>No data available</div>;
  }

  const handleSortChange = (value: "newest" | "price-asc" | "price-desc" | "name") => {
    setSortBy(value);
  };
  if(loading) {
    return <div className="flex justify-center items-center h-screen">
<div className="flex flex-row gap-2">
  <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
  <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
  <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
</div>
    </div>;
  }

  return (
    <>
      {!isMobile && (
        <button
          className="bg-blue-500 text-black p-2 rounded absolute top-[70px]  right-4 z-50 shadow-md lg:hidden"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <FiFilter size={20} />
        </button>
      )}
      <div className=" gap-3 relative ">
        <div className="flex-1 ">
          {isMobileFilterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50  flex items-center justify-center">
              <div
                className="bg-white/60 backdrop-blur-sm border p-6 mx-10 rounded-lg min-w-[80%] overflow-x-hidden"
                dir="rtl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">فیلترها</h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      دسته‌بندی
                    </label>
                    <select
                      className="w-full border rounded-md p-2"
                      onChange={(e) =>
                        setSelectedFilters((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                    >
                      <option value="">همه</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رنگ‌ها
                    </label>
                    <button
                      onClick={() => setShowColorModal(true)}
                      className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-2"
                    >
                      انتخاب رنگ
                      {selectedColors.length > 0 && (
                        <span className="bg-blue-500 text-white rounded-full px-2 py-0.5 text-sm">
                          {selectedColors.length}
                        </span>
                      )}
                    </button>
                  </div>

                  {showColorModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                      <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold">انتخاب رنگ‌ها</h3>
                          <button
                            onClick={() => setShowColorModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                        </div>

                        <div>
                          <div className="flex gap-2 flex-wrap">
                            {colors.map((colorCode, i) => (
                              <div
                                key={i}
                                onClick={() => {
                                  setSelectedColors((prev) =>
                                    prev.includes(colorCode)
                                      ? prev.filter((c) => c !== colorCode)
                                      : [...prev, colorCode]
                                  );
                                }}
                                className="flex flex-col items-center gap-1"
                              >
                                <ColorBox
                                  $color={colorCode}
                                  $selected={selectedColors.includes(colorCode)}
                                  style={{ backgroundColor: colorCode }}
                                  className="w-12 h-12"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedColors([]);
                            }}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                          >
                            پاک کردن
                          </button>
                          <button
                            onClick={() => {
                              handleFilter();
                              setShowColorModal(false);
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            تایید
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="price-range-container">
                    <h3 className="text-lg pb-2">فیلتر قیمت</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      قیمت از: {selectedFilters.priceMin.toLocaleString()} تا:{" "}
                      {selectedFilters.priceMax.toLocaleString()} تومان
                    </label>

                    <RangeSliderContainer>
                      <RangeSlider
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        value={selectedFilters.priceMin}
                        onChange={(e) =>
                          setSelectedFilters((prev) => ({
                            ...prev,
                            priceMin: Math.min(
                              parseInt(e.target.value),
                              selectedFilters.priceMax
                            ),
                          }))
                        }
                      />
                      <RangeSlider
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        value={selectedFilters.priceMax}
                        onChange={(e) =>
                          setSelectedFilters((prev) => ({
                            ...prev,
                            priceMax: Math.max(
                              parseInt(e.target.value),
                              selectedFilters.priceMin
                            ),
                          }))
                        }
                      />
                    </RangeSliderContainer>
                  </div>
                  <button
                    onClick={() => {
                      handleFilter();
                      setIsMobileFilterOpen(false);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    اعمال فیلتر
                  </button>
                </div>
              </div>
            </div>
          )}
          <FilterCardBg
            $data={sectionData}
            className=" top-0 right-2 absolute  "
          >
            <div className="p-6">
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    دسته‌بندی
                  </label>
                  <select
                    className="w-full border rounded-md p-2"
                    onChange={(e) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  >
                    <option value="">همه</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رنگ‌ها
                  </label>
                  <button
                    onClick={() => setShowColorModal(true)}
                    className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-2"
                  >
                    انتخاب رنگ
                    {selectedColors.length > 0 && (
                      <span className="bg-blue-500 text-white rounded-full px-2 py-0.5 text-sm">
                        {selectedColors.length}
                      </span>
                    )}
                  </button>
                </div>

                {showColorModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">انتخاب رنگ‌ها</h3>
                        <button
                          onClick={() => setShowColorModal(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>

                      <div>
                        <div className="flex gap-2 flex-wrap">
                          {colors.map((colorCode, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                setSelectedColors((prev) =>
                                  prev.includes(colorCode)
                                    ? prev.filter((c) => c !== colorCode)
                                    : [...prev, colorCode]
                                );
                              }}
                              className="flex flex-col items-center gap-1"
                            >
                              <ColorBox
                                $color={colorCode}
                                $selected={selectedColors.includes(colorCode)}
                                style={{ backgroundColor: colorCode }}
                                className="w-12 h-12"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedColors([]);
                          }}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          پاک کردن
                        </button>
                        <button
                          onClick={() => {
                            handleFilter();
                            setShowColorModal(false);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          تایید
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="price-range-container">
                  <h3 className="text-lg pb-2">فیلتر قیمت</h3>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    قیمت از: {selectedFilters.priceMin.toLocaleString()} تا:{" "}
                    {selectedFilters.priceMax.toLocaleString()} تومان
                  </label>

                  <RangeSliderContainer>
                    <RangeSlider
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={selectedFilters.priceMin}
                      onChange={(e) =>
                        setSelectedFilters((prev) => ({
                          ...prev,
                          priceMin: Math.min(
                            parseInt(e.target.value),
                            selectedFilters.priceMax
                          ),
                        }))
                      }
                    />
                    <RangeSlider
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={selectedFilters.priceMax}
                      onChange={(e) =>
                        setSelectedFilters((prev) => ({
                          ...prev,
                          priceMax: Math.max(
                            parseInt(e.target.value),
                            selectedFilters.priceMin
                          ),
                        }))
                      }
                    />
                  </RangeSliderContainer>
                </div>

                <FilterBtn $data={sectionData} onClick={handleFilter}>
                  اعمال فیلتر
                </FilterBtn>
              </div>
            </div>
          </FilterCardBg>
          <FilterBgRow $data={sectionData}>
            <div className="flex w-[100%] items-center gap-4 lg:gap-6 p-4 border-b">
              <FilteNameRow
                $data={sectionData}
                className="opacity-70 font-semibold text-xs lg:text-lg"
              >
                مرتب‌سازی بر اساس :
              </FilteNameRow>
              <div className="flex gap-6">
                {sortOptions.map((option) => (
                  <FilteNameRow
                    $data={sectionData}
                    key={option.value}
                    onClick={() =>
                      handleSortChange(
                        option.value as
                          | "newest"
                          | "price-asc"
                          | "price-desc"
                          | "name"
                      )
                    }
                    className={`pb-1 text-center text-xs lg:text-lg relative cursor-pointer transition-all duration-200 ease-in-out ${
                      sortBy === option.value
                        ? 'text-blue-500 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500'
                        : " hover:text-blue-500"
                    }`}
                  >
                    {option.label}
                  </FilteNameRow>
                ))}
              </div>
            </div>
          </FilterBgRow>

          <SectionProductList
  $data={sectionData}
  $isMobile={isMobile}
  $previewWidth="default"
  className="mt-20 min-h-[500px]"
>
  {filteredProducts.map((product) => (
    <ProductCard key={product._id} productData={product} />
  ))}
</SectionProductList>

        </div>
      </div>
    </>
  );
};

export default ProductList;
