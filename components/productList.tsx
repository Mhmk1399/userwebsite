"use client";
import styled from "styled-components";
import {
  ProductSection,
  ProductCardData,
  ProductBlockSetting,
} from "@/lib/types";
import ProductCard from "./productCard";
import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { FiFilter } from "react-icons/fi";
import { Toaster } from "react-hot-toast";

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

const FilterSidebar = styled.div<{
  $data: ProductBlockSetting;
  $isMobile: boolean;
}>`
  background-color: ${(props) => props.$data?.filterCardBg || "#ffffff"};
  border-radius: 12px;
  width: 280px;
  min-height: 400px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: ${(props) => (props.$isMobile ? "none" : "block")};
  position: sticky;
  top: 20px;
  
  @media (max-width: 1024px) {
    display: none;
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
  height: 2px;
  background: none;

  &::-webkit-slider-thumb {
    pointer-events: all;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #2563eb;
    cursor: pointer;
    appearance: none;
    z-index: 3;
    position: relative;
  }
`;

const SectionProductList = styled.section<{
  $data: ProductSection;
  $previewWidth: "sm" | "default";
  $isMobile: boolean;
}>`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  width: 100%;
  direction: rtl;
  padding-top: ${(props) => props.$data?.setting?.paddingTop}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom}px;
  margin-left: ${(props) => props.$data?.setting?.marginLeft}px;
  margin-right: ${(props) => props.$data?.setting?.marginRight}px;
  background-color: ${(props) => props.$data?.setting?.backgroundColor};
  box-shadow: ${(props) =>
    `${props.$data.setting?.shadowOffsetX || 0}px 
     ${props.$data.setting?.shadowOffsetY || 4}px 
     ${props.$data.setting?.shadowBlur || 10}px 
     ${props.$data.setting?.shadowSpread || 0}px 
     ${props.$data.setting?.shadowColor || "#fff"}`};
  border-radius: ${(props) => props.$data.setting?.Radius || "10"}px;

  ${(props) =>
    !props.$isMobile &&
    `
    display: grid;
    grid-template-columns: repeat(${props.$data.setting?.gridColumns}, 1fr);
    overflow-x: hidden;
  `}

  @media (max-width: 426px) {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;

    & > div {
      flex: 0 0 auto;
      width: 80%;
      scroll-snap-align: start;
    }
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
    { value: "price-asc", label: "ارزانترین" },
    { value: "price-desc", label: "گرانترین" },
    { value: "name", label: "نام محصول" },
  ];
  const pathname = usePathname();
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

    if (selectedFilters.category) {
      filtered = filtered.filter(
        (product) => product.category?.name === selectedFilters.category
      );
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) =>
        product.colors?.some((color) => selectedColors.includes(color.code))
      );
    }

    filtered = filtered.filter((product) => {
      const price = parseInt(product.price);
      return (
        price >= selectedFilters.priceMin && price <= selectedFilters.priceMax
      );
    });

    const sortedFiltered = getSortedProducts(filtered);
    setFilteredProducts(sortedFiltered);
  }, [productData, selectedColors, selectedFilters, sortBy]);

  const searchParams = useSearchParams();
  const urlString = searchParams.toString();
  const categoryParam = decodeURIComponent(
    urlString.split("=")[1]?.replace(/\+/g, " ")
  );

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
      } else {
        await getCollection();
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

  useEffect(() => {
    if (productData.length > 0) {
      setFilteredProducts(productData);
      handleFilter();
    }
  }, [productData, handleFilter]);

  useEffect(() => {
    if (productData.length > 0) {
      handleFilter();
    }
  }, [selectedFilters, sortBy, selectedColors, handleFilter]);

  const sectionData = sections.find(
    (section) => section.type === componentName
  );

  if (!sectionData) return null;

  const handleSortChange = (
    value: "newest" | "price-asc" | "price-desc" | "name"
  ) => {
    setSortBy(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <button
        className="fixed top-20 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg lg:hidden hover:bg-blue-700 transition-colors"
        onClick={() => setIsMobileFilterOpen(true)}
      >
        <FiFilter size={20} />
      </button>
      
      <div className="flex gap-6 relative">
        <FilterSidebar
          $isMobile={isMobile}
          $data={sectionData.setting}
          className="hidden lg:block"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">فیلترها</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  دستهبندی
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  <option value="">همه دستهبندیها</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رنگها
                </label>
                <button
                  onClick={() => setShowColorModal(true)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <span>انتخاب رنگ</span>
                  {selectedColors.length > 0 && (
                    <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                      {selectedColors.length}
                    </span>
                  )}
                </button>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">محدوده قیمت</h4>
                <div className="mb-3">
                  <span className="text-sm text-gray-600">
                    {selectedFilters.priceMin.toLocaleString()} - {selectedFilters.priceMax.toLocaleString()} تومان
                  </span>
                </div>
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
                onClick={handleFilter}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                اعمال فیلتر
              </button>
            </div>
          </div>
        </FilterSidebar>
        
        <div className="flex-1 min-w-0">
          {isMobileFilterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div
                className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                dir="rtl"
              >
                <div className="flex justify-between items-center p-6 border-b">
                  <h3 className="text-xl font-bold text-gray-800">فیلترها</h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      دستهبندی
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onChange={(e) =>
                        setSelectedFilters((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                    >
                      <option value="">همه دستهبندیها</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      رنگها
                    </label>
                    <button
                      onClick={() => setShowColorModal(true)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
                    >
                      <span>انتخاب رنگ</span>
                      {selectedColors.length > 0 && (
                        <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                          {selectedColors.length}
                        </span>
                      )}
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">محدوده قیمت</h4>
                    <div className="mb-3">
                      <span className="text-sm text-gray-600">
                        {selectedFilters.priceMin.toLocaleString()} - {selectedFilters.priceMax.toLocaleString()} تومان
                      </span>
                    </div>
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
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    اعمال فیلتر
                  </button>
                </div>
              </div>
            </div>
          )}

          {showColorModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-xl w-96 max-h-[80vh] overflow-y-auto shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">انتخاب رنگها</h3>
                  <button
                    onClick={() => setShowColorModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
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
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedColors([])}
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

          <div className="bg-white border-b border-gray-200 mb-6">
            <div className="flex flex-wrap items-center gap-4 p-4">
              <span className="text-gray-600 font-medium text-sm lg:text-base">
                مرتبسازی بر اساس:
              </span>
              <div className="flex flex-wrap gap-4">
                {sortOptions.map((option) => (
                  <button
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
                    className={`px-3 py-2 text-sm lg:text-base rounded-lg transition-all duration-200 ${
                      sortBy === option.value
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <SectionProductList
            $data={sectionData}
            $isMobile={isMobile}
            $previewWidth="default"
            className="min-h-[500px]"
          >
            {(filteredProducts.length > 0 ? filteredProducts : productData).map(
              (product) => (
                <ProductCard
                  key={product._id}
                  productData={product}
                />
              )
            )}
          </SectionProductList>
        </div>
      </div>
    </>
  );
};

export default ProductList;