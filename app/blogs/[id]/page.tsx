"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";
import { BlogDetailSection, HeaderSection, FooterSection, Section } from "@/lib/types";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface BlogDetailData {
  _id: string;
  title: string;
  subtitle?: string;
  content: string;
  imageSrc: string;
  imageAlt: string;
  createdAt: string;
  author: string;
}

// Next.js 15+ page component props structure with Promise params
interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Internal component props
interface BlogDetailProps {
  isMobile: boolean;
}

// Styled components based on blogdetaillg.json settings
const SectionBlogDetail = styled.div<{
  $data: BlogDetailSection;
  $isMobile?: boolean;
}>`
  padding-top: ${(props) => props.$data?.setting?.paddingTop || 10}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom || 10}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft || 30}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight || 30}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop || 0}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || 0}px;
  background-color: ${(props) =>
    props.$data?.setting?.backgroundColor || "#ffffff"};

  .blog-title {
    color: ${(props) => props.$data?.setting?.titleColor || "#1A1A1A"};
    font-size: ${(props) =>
      props.$isMobile
        ? Math.max(
            18,
            parseInt(props.$data?.setting?.titleFontSize || "36") * 0.6
          )
        : props.$data?.setting?.titleFontSize || 36}px;
    font-weight: bold;
    margin-bottom: 16px;

    @media (max-width: 768px) {
      font-size: ${(props) =>
        Math.max(
          16,
          parseInt(props.$data?.setting?.titleFontSize || "36") * 0.5
        )}px;
    }
  }

  .blog-content {
    color: ${(props) => props.$data?.setting?.contentColor || "#2C2C2C"};
    font-size: ${(props) =>
      props.$isMobile
        ? Math.max(
            14,
            parseInt(props.$data?.setting?.contentFontSize || "18") * 0.8
          )
        : props.$data?.setting?.contentFontSize || 18}px;
    line-height: 1.8;
    margin-top: 24px;

    img {
      max-width: 1000px;
      height: 500px;
      object-fit: cover;
      border-radius: 8px;
      margin: 16px auto;
      display: block;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
      font-size: ${(props) =>
        Math.max(
          12,
          parseInt(props.$data?.setting?.contentFontSize || "18") * 0.7
        )}px;
      
      img {
        margin: 12px auto;
        border-radius: 6px;
      }
    }
  }

  .blog-meta {
    color: ${(props) => props.$data?.setting?.metaColor || "#666666"};
    font-size: ${(props) =>
      props.$isMobile
        ? Math.max(
            12,
            parseInt(props.$data?.setting?.metaFontSize || "14") * 0.9
          )
        : props.$data?.setting?.metaFontSize || 14}px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      font-size: ${(props) =>
        Math.max(
          10,
          parseInt(props.$data?.setting?.metaFontSize || "14") * 0.8
        )}px;
    }
  }
`;

const CoverImageContainer = styled.div<{
  $data: BlogDetailSection;
  $isMobile?: boolean;
}>`
  width: ${(props) =>
    props.$isMobile
      ? Math.min(300, parseInt(props.$data?.setting?.coverImageWidth || "600"))
      : props.$data?.setting?.coverImageWidth || 600}px;
  height: ${(props) =>
    props.$isMobile
      ? Math.min(200, parseInt(props.$data?.setting?.coverImageHeight || "400"))
      : props.$data?.setting?.coverImageHeight || 400}px;
  position: relative;
  border-radius: ${(props) => props.$data?.setting?.imageRadius || 10}px;
  overflow: hidden;
  margin: 0 auto 24px auto;
  cursor: pointer;
  transition: transform 0.3s ease;

  /* Apply animations using CSS filters and properties that don't affect positioning */
  ${(props) => {
    const animation = props.$data.setting.animation;
    if (!animation) return "";

    const { type, animation: animConfig } = animation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: blogImagePulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes blogImagePulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
      `;
    } else if (animConfig.type === "ping") {
      return `
        ${selector} {
          animation: blogImagePing ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes blogImagePing {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }
      `;
    } else if (animConfig.type === "bgOpacity") {
      return `
        ${selector} {
          animation: blogImageBgOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes blogImageBgOpacity {
          0%, 100% { 
            opacity: 1;
          }
          50% { 
            opacity: 0.7;
          }
        }
      `;
    } else if (animConfig.type === "scaleup") {
      return `
        ${selector} {
          animation: blogImageScaleup ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes blogImageScaleup {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }
      `;
    } else if (animConfig.type === "scaledown") {
      return `
        ${selector} {
          animation: blogImageScaledown ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes blogImageScaledown {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(0.95);
          }
        }
      `;
    }

    return "";
  }}

  @media (max-width: 768px) {
    width: ${(props) =>
      Math.min(
        280,
        parseInt(props.$data?.setting?.coverImageWidth || "600")
      )}px;
    height: ${(props) =>
      Math.min(
        180,
        parseInt(props.$data?.setting?.coverImageHeight || "400")
      )}px;
  }
`;

// Internal component that uses the BlogDetailProps

const BlogDetailContent: React.FC<BlogDetailProps & { blogId: string }> = ({
  isMobile,
  blogId,
}) => {
  const [blog, setBlog] = useState<BlogDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sectionData, setSectionData] = useState<BlogDetailSection | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headerData, setHeaderData] = useState<HeaderSection | null>(null);
  const [footerData, setFooterData] = useState<FooterSection | null>(null);

  const fetchLayoutData = async (activeMode: string, storeId: string) => {
    try {
      const response = await fetch("/api/layout-jason", {
        method: "GET",
        headers: {
          selectedRoute: "blog",
          activeMode: activeMode,
          storeId: "storemfcdfog4456qhn",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch layout data: ${response.status}`);
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

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await fetch(`/api/blog/${blogId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog details");
        }
        const data = await response.json();

        setBlog(data.blog);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlogDetail();
    }
  }, [blogId]);

  useEffect(() => {
    const handleLayoutFetch = async () => {
      const activeMode = isMobile ? "sm" : "lg";
      const storeId = process.env.STOREID || "";

      try {
        setIsLoading(true);
        setError(null);

        const layoutData = await fetchLayoutData(activeMode, storeId);

        if (layoutData && layoutData.sections && layoutData.sections.children) {
          setSections(layoutData.sections.children.sections);
          const blogDetailSection = layoutData.sections.children.sections.find(
            (section: Section) => section.type === "BlogDetail"
          ) as BlogDetailSection;
          setSectionData(blogDetailSection);

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

    handleLayoutFetch();
  }, [isMobile]);

  if (isLoading || loading) {
    return (
      <>
        <Header isMobile={isMobile} headerData={headerData ?? undefined} />
        <main>
          <div className="flex justify-center items-center h-screen">
            <div className="flex flex-row gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
              <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        </main>
        <Footer footerData={footerData ?? undefined} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header isMobile={isMobile} headerData={headerData ?? undefined} />
        <main>
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
        </main>
        <Footer footerData={footerData ?? undefined} />
      </>
    );
  }

  if (!blog || !sectionData) {
    return (
      <>
        <Header isMobile={isMobile} headerData={headerData ?? undefined} />
        <main>
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-600 mb-4">
                بلاگ مورد نظر یافت نشد
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
        <SectionBlogDetail
          $data={sectionData}
          $isMobile={isMobile}
          className={`transition-all duration-150 ease-in-out relative`}
        >
      <CoverImageContainer $data={sectionData} $isMobile={isMobile}>
        <Image
          src={
            sectionData.setting.coverImage ||
            blog.image
          }
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
      </CoverImageContainer>

      <h1 className="blog-title text-right">{blog.title || "عنوان بلاگ"}</h1>

      <div className="blog-meta text-right">
        <span>{blog.author || "نویسنده"} : نویسنده </span>
        <br />
        <span>
          تاریخ :
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
        className="blog-content text-right"
        dangerouslySetInnerHTML={{
          __html: blog.content || "محتوای بلاگ در اینجا نمایش داده می‌شود...",
        }}
      />
        </SectionBlogDetail>
      </main>
      <Footer footerData={footerData ?? undefined} />
    </>
  );
};

// Main page component that Next.js expects
export default function BlogDetailPage({ params }: PageProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [blogId, setBlogId] = useState<string>("");

  useEffect(() => {
    // Resolve the params Promise to get the actual id
    const resolveParams = async () => {
      const resolvedParams = await params;
      setBlogId(resolvedParams.id);
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    // Determine if mobile based on screen width
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial setup
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Don't render until we have the blogId
  if (!blogId) {
    return <div>در حال بارگذاری...</div>;
  }

  // Pass the required props to the internal component
  return <BlogDetailContent isMobile={isMobile} blogId={blogId} />;
}
