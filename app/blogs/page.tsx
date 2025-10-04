"use client";
import styled from "styled-components";
import { BlogListSection, BlogListSetting, HeaderSection, FooterSection, Section } from "@/lib/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";


interface BlogData {
  blogId: number;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  author: string;
  date: string;
  btnText: string;
  btnLink: string;
  storeId: string;
  content: string;
  createdAt: string;
  id: number;
}

const SectionBlogList = styled.section<{
  $data: BlogListSection;
}>`
  display: grid;
  grid-template-columns: repeat(
    ${(props) => props.$data.setting?.gridColumns},
    1fr
  );
  gap: 10px;
  padding-top: ${(props) => props.$data?.setting?.paddingTop}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom}px;
  paddding-left: ${(props) => props.$data?.setting?.paddingLeft}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom}px;
  background-color: ${(props) => props.$data?.setting?.backgroundColor};
  box-shadow: ${(props) =>
    `${props.$data.setting?.shadowOffsetX || 0}px 
     ${props.$data.setting?.shadowOffsetY || 4}px 
     ${props.$data.setting?.shadowBlur || 10}px 
     ${props.$data.setting?.shadowSpread || 0}px 
     ${props.$data.setting?.shadowColor || "#fff"}`};
  border-radius: ${(props) => props.$data.setting?.Radius || "20"}px;

  @media (max-width: 425px) {
    grid-template-columns: repeat(1, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const BlogCard = styled.div<{
  $data: BlogListSetting;
}>`
  background: ${(props) => props.$data?.cardBackgroundColor};
  border-radius: ${(props) => props.$data?.cardBorderRadius}px;
  margin: 0 8px;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
    cursor: pointer;
  }

  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }

  .content {
    padding: 10px;
  }

  .title {
    font-size: ${(props) => props.$data?.titleSize}px;
    font-weight: bold;
    margin-bottom: 10px;
    color: ${(props) => props.$data?.textColor};
  }

  .meta {
    display: flex;
    justify-content: space-between;
    color: ${(props) => props.$data?.textColor};
    font-size: 0.875rem;
    margin-bottom: 10px;
  }

  .description {
    font-size: ${(props) => props.$data?.descriptionSize}px;
    margin-bottom: 15px;
    color: ${(props) => props.$data?.textColor};
  }

  .read-more {
    display: inline-block;
    padding: 8px 16px;
    color: ${(props) => props.$data?.buttonColor};
    border-radius: ${(props) => props.$data.btnRadius || "20"}px;
    text-decoration: none;
    transition: background 0.3s ease;
    background-color: ${(props) => props.$data?.btnBackgroundColor};

    &:hover {
      opacity: 0.8;
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
  grid-column: 1 / -1;
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: ${props => props.$active ? '#007bff' : '#fff'};
  color: ${props => props.$active ? '#fff' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: ${props => props.$active ? '#0056b3' : '#f8f9fa'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function Page() {
  const [blogData, setBlogData] = useState<BlogData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalBlogs: 0,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headerData, setHeaderData] = useState<HeaderSection | null>(null);
  const [footerData, setFooterData] = useState<FooterSection | null>(null);

  const fetchLayoutData = async (activeMode: string) => {
    try {
      const response = await fetch("/api/layout-jason", {
        method: "GET",
        headers: {
          selectedRoute: "blogs",
          activeMode: activeMode,
        },
      });

      if (!response.ok) {
        console.log(`Failed to fetch layout data: ${response.status}`);
      }

      const layoutData = await response.json();
      
      if (layoutData.sections?.sectionHeader) {
        setHeaderData(layoutData.sections.sectionHeader);
      }
      
      if (layoutData.sections?.sectionFooter) {
        setFooterData(layoutData.sections.sectionFooter);
      }
      
      return layoutData;
    } catch (error) {
      console.error("Error fetching layout data:", error);
      throw error;
    }
  };

  const fetchBlogs = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blog?page=${page}&limit=6`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.blogs && Array.isArray(data.blogs)) {
        const blogInfo = data.blogs.map((blog: BlogData) => ({
          ...blog,
          btnLink: `/blogs/${blog.blogId}`,
          imageSrc: "/assets/images/pro3.jpg",
          imageAlt: blog.title,
          description: blog.description,
          storeId: blog.storeId,
        }));
        setBlogData(blogInfo);
        
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else {
        console.error('Invalid API response structure:', data);
        setBlogData([]);
      }
    } catch (error) {
      console.log("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = async () => {
      const isMobileView = window.innerWidth < 430;
      setIsMobile(isMobileView);

      const activeMode = isMobileView ? "sm" : "lg";

      try {
        setIsLoading(true);
        setError(null);

        const layoutData = await fetchLayoutData(activeMode);

        if (layoutData && layoutData.sections && layoutData.sections.children) {
          setSections(layoutData.sections.children.sections);

          if (layoutData.sections.children.metaData) {
            document.title = layoutData.sections.children.metaData.title;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
              metaDescription.setAttribute(
                "content",
                layoutData.sections.children.metaData.description
              );
            }
          }
        }
      } catch (error) {
        console.error("Error loading page data:", error);
        setError("خطا در بارگذاری صفحه");
      } finally {
        setIsLoading(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
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

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            خطا در بارگذاری صفحه
          </h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            دوباره تلاش کنید
          </button>
        </div>
      </div>
    );
  }

  const sectionData = sections?.find(
    (section) => section.type === "BlogList"
  ) as unknown as BlogListSection;

  if (!sectionData) {
    return (
      <>
        <Header isMobile={isMobile} headerData={headerData ?? undefined} />
        <main>
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-600 mb-4">
                صفحه مورد نظر خالی است
              </h1>
            </div>
          </div>
        </main>
        <Footer footerData={footerData ?? undefined} />
      </>
    );
  }

  return (
    <>
      <Header isMobile={isMobile} headerData={headerData ?? undefined} />
      <main>
        <SectionBlogList dir="rtl" $data={sectionData}>
      {loading ? (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
          در حال بارگذاری...
        </div>
      ) : (
        blogData.map((blog, index) => (
          <BlogCard key={`blogs-${blog.id}-${index}`} $data={sectionData.setting}>
            {blog.image ? (
              <Image
                src={blog.image || "/assets/images/pro2.jpg"}
                alt={blog.title || "Blog image"}
                width={1000}
                height={800}
              />
            ) : null}
            <div className="content">
              <h2 className="title line-clamp-1">{blog.title}</h2>
              <div className="meta">
                <span>
                  {blog.createdAt &&
                    new Intl.DateTimeFormat("fa-IR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      calendar: "persian",
                    }).format(new Date(blog.createdAt))}
                </span>
              </div>
              <div
                className="description mb-2 text-right"
                dangerouslySetInnerHTML={{
                  __html: blog.content.slice(0, 70) + "...",
                }}
              />
              <Link href={`/blogs/${blog.id}`} className="read-more">
                مطالعه بیشتر
              </Link>
            </div>
          </BlogCard>
        ))
      )}
      
      {pagination.totalPages > 1 && (
        <PaginationContainer>
          <PaginationButton 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrev}
          >
            قبلی
          </PaginationButton>
          
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
            <PaginationButton
              key={page}
              $active={page === currentPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationButton>
          ))}
          
          <PaginationButton 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNext}
          >
            بعدی
          </PaginationButton>
        </PaginationContainer>
      )}
        </SectionBlogList>
      </main>
      <Footer footerData={footerData ?? undefined} />
    </>
  );
}