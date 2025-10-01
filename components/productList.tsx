"use client";
import styled from "styled-components";
import {
  ProductSection,
  ProductCardData,
  ProductBlockSetting,
} from "@/lib/types";
import ProductCard from "./productCard";
import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { FiFilter } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

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
  position: sticky;
  top: 0;
  min-width: 100%;
  z-index: 30;
  direction: rtl;
`;

const FilterNameRow = styled.div<{
  $data: ProductBlockSetting;
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data?.filterNameColor};
  font-size: ${(props) => (props.$isMobile ? "12" : "16")}px;
`;

const FilterCardBg = styled.div<{
  $data: ProductBlockSetting;
  $isMobile: boolean;
}>`
  background-color: ${(props) => props.$data?.filterCardBg || "#ffffff"};
  border-radius: 12px;
  width: 356px;
  display: ${(props) => (props.$isMobile ? "none" : "block")};
  position: sticky;
  top: 80px;
  height: fit-content;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  @media (max-width: 1024px) {
    display: none;
  }
`;

const FilterBtn = styled.div<{ $data: ProductBlockSetting }>`
  background-color: ${(props) => props.$data?.filterButtonBg || "#2563eb"};
  color: ${(props) => props.$data?.filterButtonTextColor || "#ffffff"};
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  cursor: pointer;
  transition: opacity 0.2s;
  font-size: 16px;
  font-weight: 500;

  &:hover {
    opacity: 0.9;
  }
`;

const ColorBox = styled.div<ColorBoxProps>`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background-color: ${(props) => props.$color};
  cursor: pointer;
  border: 2px solid ${(props) => (props.$selected ? "#2563eb" : "transparent")};
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

const PriceInputContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  justify-content: space-between;
`;

const PriceInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  text-align: center;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ApplyButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: #2563eb;
  color: white;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const SectionProductList = styled.section<{
  $data: ProductSection;
  $previewWidth: "sm" | "default";
  $isMobile: boolean;
}>`
  display: flex;
  flex-wrap: wrap;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  direction: rtl;
  padding: 2rem;
  margin-top: ${(props) => props.$data?.setting?.marginTop || 0}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || 0}px;
  margin-left: ${(props) => props.$data?.setting?.marginLeft || 0}px;
  margin-right: ${(props) => props.$data?.setting?.marginRight || 0}px;
  background-color: ${(props) =>
    props.$data?.setting?.backgroundColor || "#ffffff"};
  box-shadow: ${(props) =>
    `${props.$data.setting?.shadowOffsetX || 0}px
     ${props.$data.setting?.shadowOffsetY || 4}px
     ${props.$data.setting?.shadowBlur || 10}px
     ${props.$data.setting?.shadowSpread || 0}px
     ${props.$data.setting?.shadowColor || "rgba(0,0,0,0.05)"}`};
  border-radius: ${(props) => props.$data.setting?.Radius || "12"}px;
  gap: 2rem;

  ${(props) =>
    !props.$isMobile &&
    `
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    overflow-x: hidden;
    gap: 2rem;
    padding: 2rem;
  `}

  @media (max-width: 1024px) and (min-width: 769px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding: 1rem;
    gap: 1rem;

    & > div {
      flex: 0 0 85%;
      scroll-snap-align: start;
      min-width: 280px;
      max-width: 320px;
    }
  }

  @media (max-width: 426px) {
    padding: 0.75rem;
    gap: 0.75rem;

    & > div {
      flex: 0 0 90%;
      min-width: 240px;
      max-width: 280px;
    }
  }
`;

const MobileFilterModal = styled.div`
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
  position: relative;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 426px) {
    padding: 1rem;
  }
`;

const SortContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  gap: ${(props) => (props.$isMobile ? "0.5rem" : "2rem")};
  overflow-x: ${(props) => (props.$isMobile ? "auto" : "visible")};
  padding: ${(props) => (props.$isMobile ? "0.25rem 0" : "0")};
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 2px;
  }

  @media (min-width: 769px) {
    overflow-x: visible;
  }
`;

const SortOption = styled.div<{
  $data: ProductBlockSetting;
  $isMobile: boolean;
  $active: boolean;
}>`
  color: ${(props) => props.$data?.filterNameColor || "#000"};
  font-size: ${(props) => (props.$isMobile ? "11px" : "14px")};
  padding: ${(props) => (props.$isMobile ? "0.25rem 0.5rem" : "0.5rem 1rem")};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  border-radius: 4px;

  ${(props) =>
    props.$active
      ? `
        color: #2563eb;
        font-weight: 800;
        background-color: rgba(37, 99, 235, 0.1);
      `
      : `
        &:hover {
          color: #2563eb;
          background-color: rgba(37, 99, 235, 0.05);
        }
      `}
`;

const ColorModal = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ColorModalContent = styled.div`
  background-color: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 28rem;
  max-height: 80vh;
  overflow-y: auto;
  padding: 1.5rem;
`;

const ProductList: React.FC<ProductListProps> = ({
  sections,
  isMobile,
  componentName,
}) => {
  const [productData, setProductData] = useState<ProductCardData[]>([]);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [sortBy, setSortBy] = useState<
    "newest" | "price-asc" | "price-desc" | "name"
  >("newest");
  const [colors, setColors] = useState<string[]>([]);
  const [showColorModal, setShowColorModal] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const sortOptions = [
    { value: "newest", label: "جدیدترین" },
    { value: "price-asc", label: "ارزانترین" },
    { value: "price-desc", label: "گرانترین" },
    { value: "name", label: "نام محصول" },
  ];
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    priceMin: "",
    priceMax: "",
  });

  // Temporary price inputs for better UX
  const [tempPriceMin, setTempPriceMin] = useState("");
  const [tempPriceMax, setTempPriceMax] = useState("");

  const getCollection = async () => {
    const collectionId = pathname.split("/").pop();
    const response = await fetch(`/api/collection/${collectionId}`, {
      cache: "no-store",
    });
    const data = await response.json();
    setProductData(data.products);
  };

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    const sp = Object.fromEntries(searchParams.entries());
    setSelectedFilters({
      category: sp.category || "",
      priceMin: sp.priceMin || "",
      priceMax: sp.priceMax || "",
    });
    setTempPriceMin(sp.priceMin || "");
    setTempPriceMax(sp.priceMax || "");
    setSelectedColors(sp.colors ? sp.colors.split(",") : []);
    setSortBy((sp.sortBy || "newest") as any);
    setCurrentPage(parseInt(sp.page || "1"));

    const isStoreRoute = pathname.split("/")[1] === "store";
    if (isStoreRoute) {
      await fetchProducts(currentPage);
    } else {
      await getCollection();
    }
    setLoading(false);
  }, [searchParams, pathname, currentPage]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (pathname.split("/")[1] === "store") {
      setCurrentPage(1);
      fetchProducts(1);
    }
  }, [selectedFilters, selectedColors, sortBy, pathname]);

  useEffect(() => {
    if (pathname.split("/")[1] === "store") {
      fetchProducts(currentPage);
    }
  }, [currentPage, pathname]);

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
    };
    fetchCategories();
  }, []);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const categoryId = searchParams.get("categoryId");
      const params = new URLSearchParams();
      if (categoryId) params.append("categoryId", categoryId);
      if (selectedFilters.category)
        params.append("category", selectedFilters.category);
      if (selectedColors.length > 0)
        params.append("colors", selectedColors.join(","));
      if (selectedFilters.priceMin)
        params.append("priceMin", selectedFilters.priceMin);
      if (selectedFilters.priceMax)
        params.append("priceMax", selectedFilters.priceMax);
      params.append("sortBy", sortBy);

      params.append("page", page.toString());
      params.append("limit", "10");

      const response = await fetch(`/api/store?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data?.products) {
        setProductData(data.products);
        setTotalPages(data.totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    // Preserve categoryId
    const categoryId = searchParams.get("categoryId");
    if (categoryId) {
      params.set("categoryId", categoryId);
    } else {
      params.delete("categoryId");
    }

    // Category
    if (selectedFilters.category) {
      params.set("category", selectedFilters.category);
    } else {
      params.delete("category");
    }

    // Colors
    if (selectedColors.length > 0) {
      params.set("colors", selectedColors.join(","));
    } else {
      params.delete("colors");
    }

    // Price
    if (selectedFilters.priceMin) {
      params.set("priceMin", selectedFilters.priceMin);
    } else {
      params.delete("priceMin");
    }

    if (selectedFilters.priceMax) {
      params.set("priceMax", selectedFilters.priceMax);
    } else {
      params.delete("priceMax");
    }

    // Sort
    if (sortBy !== "newest") {
      params.set("sortBy", sortBy);
    } else {
      params.delete("sortBy");
    }

    // Page
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    } else {
      params.delete("page");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    selectedFilters,
    selectedColors,
    sortBy,
    currentPage,
    pathname,
    router,
    searchParams,
  ]);

  const sectionData = sections.find(
    (section) => section.type === componentName
  );

  if (!sectionData) return null;

  const handleSortChange = (
    value: "newest" | "price-asc" | "price-desc" | "name"
  ) => {
    setSortBy(value);
  };

  const resetFilters = () => {
    setSelectedFilters({
      category: "",
      priceMin: "",
      priceMax: "",
    });
    setTempPriceMin("");
    setTempPriceMax("");
    setSelectedColors([]);
    setSortBy("newest" as const);
    setCurrentPage(1);
  };

  const applyPriceFilter = () => {
    // Validate inputs
    const min = tempPriceMin ? parseInt(tempPriceMin) : 0;
    const max = tempPriceMax ? parseInt(tempPriceMax) : 0;

    // Only apply if valid
    if (tempPriceMax && min > max) {
      toast.error("قیمت حداقل نمی‌تواند از قیمت حداکثر بیشتر باشد");
      return;
    }

    setSelectedFilters((prev) => ({
      ...prev,
      priceMin: tempPriceMin,
      priceMax: tempPriceMax,
    }));
  };

  const handlePriceKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyPriceFilter();
    }
  };

  const renderPriceFilter = () => (
    <div className="price-filter-container">
      <h3 className="text-lg font-bold text-gray-800 pb-3">فیلتر قیمت</h3>
      <PriceInputContainer>
        <div className="flex flex-col items-center flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1">
            از (تومان)
          </label>
          <PriceInput
            type="number"
            placeholder="0"
            value={tempPriceMin}
            onChange={(e) => setTempPriceMin(e.target.value)}
            onKeyPress={handlePriceKeyPress}
          />
        </div>
        <div className="flex flex-col items-center flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1">
            تا (تومان)
          </label>
          <PriceInput
            type="number"
            placeholder="بدون محدودیت"
            value={tempPriceMax}
            onChange={(e) => setTempPriceMax(e.target.value)}
            onKeyPress={handlePriceKeyPress}
          />
        </div>
      </PriceInputContainer>
      <ApplyButton onClick={applyPriceFilter}>اعمال فیلتر قیمت</ApplyButton>
    </div>
  );

  return (
    <>
      {isMobile && (
        <button
          className="bg-blue-500 text-white p-3 rounded-full fixed bottom-6 right-6 z-50 shadow-lg hover:bg-blue-600 transition-colors"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <FiFilter size={20} />
        </button>
      )}
      <div className="flex flex-row-reverse gap-8 relative mx-auto px-4   ">
        <FilterCardBg
          $isMobile={isMobile}
          $data={sectionData.setting}
          className="w-full hidden lg:block"
        >
          <div className="p-2 text-right">
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  دسته‌بندی
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 text-right text-base"
                  value={selectedFilters.category}
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
                  className="w-full px-4 py-3 bg-gray-100 text-right rounded-lg hover:bg-gray-200 flex flex-row-reverse items-center justify-between text-base transition-colors"
                >
                  انتخاب رنگ
                  {selectedColors.length > 0 && (
                    <span className="bg-blue-500 text-white text-right rounded-full px-3 py-1 text-sm">
                      {selectedColors.length}
                    </span>
                  )}
                </button>
              </div>

              {renderPriceFilter()}

              <div className="flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-base font-medium"
                >
                  بازنشانی
                </button>
              </div>
            </div>
          </div>
        </FilterCardBg>
        <div className="flex-1 relative">
          {isMobileFilterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center md:hidden">
              <MobileFilterModal dir="rtl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">فیلترها</h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="text-gray-600 hover:text-gray-800 text-2xl"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-6 pb-24">
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-2">
                      دسته‌بندی
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-3 text-base bg-white"
                      value={selectedFilters.category}
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
                    <label className="block text-base font-medium text-gray-800 mb-2">
                      رنگ‌ها
                    </label>
                    <button
                      onClick={() => setShowColorModal(true)}
                      className="w-full px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-between text-base transition-colors"
                    >
                      <span>انتخاب رنگ</span>
                      {selectedColors.length > 0 && (
                        <span className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm">
                          {selectedColors.length}
                        </span>
                      )}
                    </button>
                  </div>

                  {renderPriceFilter()}
                </div>
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg rounded-t-2xl z-50">
                  <div className="flex gap-4 max-w-md mx-auto">
                    <button
                      onClick={() => {
                        resetFilters();
                      }}
                      className="flex-1 px-4 sm:px-6 py-3 text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 text-base font-medium transition-colors"
                    >
                      بازنشانی
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileFilterOpen(false);
                      }}
                      className="flex-1 px-4 sm:px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-base font-medium transition-colors"
                    >
                      بستن
                    </button>
                  </div>
                </div>
              </MobileFilterModal>
            </div>
          )}
          <FilterBgRow $data={sectionData}>
            <div className="flex w-full items-center gap-4 p-4 sm:p-6 border-b border-gray-200">
              <FilterNameRow
                $data={sectionData.setting}
                $isMobile={isMobile}
                className="opacity-70 font-semibold text-sm lg:text-base flex-shrink-0"
              >
                مرتب‌سازی بر اساس :
              </FilterNameRow>
              <SortContainer className="w-fit" $isMobile={isMobile}>
                {sortOptions.map((option) => (
                  <SortOption
                    $data={sectionData.setting}
                    $isMobile={isMobile}
                    $active={sortBy === option.value}
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
                  >
                    {option.label}
                  </SortOption>
                ))}
              </SortContainer>
            </div>
          </div>

          <SectionProductList
            $data={sectionData}
            $isMobile={isMobile}
            $previewWidth="default"
            className="mt-0 min-h-[600px]"
          >
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-20">
                <div className="text-gray-500">در حال بارگذاری...</div>
              </div>
            ) : productData.length === 0 ? (
              <div className="col-span-full flex justify-center items-center py-20">
                <div className="text-gray-500">محصولی یافت نشد</div>
              </div>
            ) : (
              productData.map((product) => (
                <ProductCard key={product._id} productData={product} />
              ))
            )}
          </SectionProductList>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1 sm:gap-2 mt-8 pb-8 px-4">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 sm:px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                قبلی
              </button>

              <div className="flex gap-1 sm:gap-2 overflow-x-auto max-w-xs sm:max-w-none">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base min-w-[32px] sm:min-w-[40px] ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                بعدی
              </button>
            </div>
          )}
        </div>
      </div>

      {showColorModal && (
        <ColorModal onClick={() => setShowColorModal(false)}>
          <ColorModalContent onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">انتخاب رنگ‌ها</h3>
              <button
                onClick={() => setShowColorModal(false)}
                className="text-gray-600 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-5 gap-4">
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
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <ColorBox
                    $color={colorCode}
                    $selected={selectedColors.includes(colorCode)}
                    style={{ backgroundColor: colorCode }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between gap-4">
              <button
                onClick={() => {
                  setSelectedColors([]);
                }}
                className="flex-1 px-6 py-3 text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 text-base transition-colors"
              >
                پاک کردن
              </button>
              <button
                onClick={() => {
                  setShowColorModal(false);
                }}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-base transition-colors"
              >
                تایید
              </button>
            </div>
          </ColorModalContent>
        </ColorModal>
      )}
      <Toaster position="bottom-center" />
    </>
  );
};

export default ProductList;