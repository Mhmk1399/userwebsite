"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";
import { BlogDetailSection } from "@/lib/types";
import largeBlogData from "../../../public/template/blogdetaillg.json";
import smallBlogData from "../../../public/template/blogdetailsm.json";

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
  padding-top: ${(props) => props.$data?.setting?.paddingTop || 0}px;
  padding-bottom: ${(props) => props.$data?.setting?.paddingBottom || 0}px;
  padding-left: ${(props) => props.$data?.setting?.paddingLeft || 0}px;
  padding-right: ${(props) => props.$data?.setting?.paddingRight || 0}px;
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

    @media (max-width: 768px) {
      font-size: ${(props) =>
        Math.max(
          12,
          parseInt(props.$data?.setting?.contentFontSize || "18") * 0.7
        )}px;
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
  const [sectionData, setSectionData] = useState<BlogDetailSection | null>(
    null
  );

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
    // Use the isMobile prop to determine which data to use
    const data = isMobile ? smallBlogData : largeBlogData;
    setSectionData(data.children.sections[0] as BlogDetailSection);
  }, [isMobile]);

  if (loading || !sectionData) {
    return <div>در حال بارگذاری...</div>;
  }

  if (!blog) {
    return <div>بلاگ مورد نظر یافت نشد.</div>;
  }

  return (
    <SectionBlogDetail
      $data={sectionData}
      $isMobile={isMobile}
      className={`transition-all duration-150 ease-in-out relative`}
    >
      <CoverImageContainer $data={sectionData} $isMobile={isMobile}>
        <Image
          src={
            sectionData.setting.coverImage ||
            blog.imageSrc ||
            "/assets/images/pro3.jpg"
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