"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
}
// Styled components based on blogdetaillg.json settings
const BlogDetailContainer = styled.div<{
  $data: BlogDetailSection;
}>`
  background-color: ${(props) =>
    props.$data?.setting?.backgroundColor || "#FFFFFF"};
  padding-top: 40px;
  padding-bottom: 40px;
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BlogCoverImage = styled(Image)<{
  $data: BlogDetailSection;
}>`
  width: 900px;
  height: 600px;
  border-radius: ${(props) => props.$data?.setting?.imageRadious || "10"}px;
`;

const BlogTitle = styled.h1<{
  $data: BlogDetailSection;
}>`
  color: ${(props) => props.$data?.setting?.titleColor || "#1A1A1A"};
  font-size: ${(props) => props.$data?.setting?.titleFontSize || "36"}px;
  font-weight: ${(props) => props.$data?.setting?.titleFontWeight || "bold"};
`;

const BlogSubtitle = styled.h2<{
  $data: BlogDetailSection;
}>`
  color: ${(props) => props.$data?.setting?.subtitleColor || "#4A4A4A"};
  font-size: ${(props) => props.$data?.setting?.subtitleFontSize || "24"}px;
`;

const BlogContent = styled.div<{
  $data: BlogDetailSection;
}>`
  color: ${(props) => props.$data?.setting?.contentColor || "#2C2C2C"};
  font-size: ${(props) => props.$data?.setting?.contentFontSize || "18"}px;
  line-height: ${(props) => props.$data?.setting?.contentLineHeight || "32"}px;
  ul,
  ol {
    padding-right: 30px;
    margin: 20px 0;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  li {
    margin-bottom: 10px;
  }
  a {
    color: #0066cc; /* Default link color */
    text-decoration: none;
    border-bottom: 1px solid rgba(0, 102, 204, 0.3);
    transition: border-color 0.3s ease;

    &:hover {
      border-bottom-color: #0066cc;
    }
  }
`;

const PublishInfo = styled.p<{
  $data: BlogDetailSection;
}>`
  color: ${(props) => props.$data?.setting?.dateColor || "#7F8C8D"};
  font-size: ${(props) => props.$data?.setting?.dateFontSize || "14"}px;
`;

export default function BlogDetailPage() {
  const [blog, setBlog] = useState<BlogDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sectionData, setSectionData] = useState<BlogDetailSection | null>(
    null
  );
  const params = useParams();

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await fetch(`/api/blog/${params.id}`);
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

    if (params.id) {
      fetchBlogDetail();
    }
  }, [params.id]);

  useEffect(() => {
    // Determine which data to use based on screen width
    const handleResize = () => {
      const data = window.innerWidth < 768 ? smallBlogData : largeBlogData;
      setSectionData(data.children.sections[0] as BlogDetailSection);
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

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <BlogDetailContainer $data={sectionData}>
      <div className="container mx-auto p-4" dir="rtl">
        <BlogCoverImage
          $data={sectionData}
          src={blog.imageSrc || "/assets/images/pro2.jpg"}
          alt={blog.imageAlt || "Blog Image"}
          width={900}
          height={600}
        />
        <BlogTitle $data={sectionData}>{blog.title}</BlogTitle>

        {blog.subtitle && (
          <BlogSubtitle $data={sectionData}>{blog.subtitle}</BlogSubtitle>
        )}

        <PublishInfo $data={sectionData}>
          منتشر شده در:{" "}
          {new Date(blog.createdAt || "").toLocaleDateString("fa-IR")}
        </PublishInfo>

        <BlogContent
          $data={sectionData}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </BlogDetailContainer>
  );
}
