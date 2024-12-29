"use client";
import React, { useEffect, useState } from "react";
import { BlogDetailSection } from "@/lib/types";
import Image from "next/image";
import { styled } from "styled-components";

interface BlogDetailProps {
  sections: BlogDetailSection[];
  isMobile: boolean;
  id: string;
}
interface BlogDetail {
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  image: string;
}
const SectionBlogDetail = styled.div<{
  $data: BlogDetailSection;
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
    font-size: ${(props) => props.$data?.setting?.titleFontSize || 36}px;
    font-weight: bold;
  }

  .blog-content {
    color: ${(props) => props.$data?.setting?.contentColor || "#2C2C2C"};
    font-size: ${(props) => props.$data?.setting?.contentFontSize || 18}px;
    line-height: 1.8;
  }

  .cover-image {
    width: ${(props) => props.$data?.setting?.coverImageWidth || 600}px;
    height: ${(props) => props.$data?.setting?.coverImageHeight || 400}px;
    position: relative;
    border-radius: ${(props) => props.$data?.setting?.imageRadius || 0}px;
    overflow: hidden;
    margin-bottom: 24px;
  }
`;

const BlogDetail: React.FC<BlogDetailProps> = ({ sections, isMobile, id }) => {
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const blogId = id;

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await fetch(`/api/blogs/${blogId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog detail");
        }
        const data = await response.json();
        console.log("Blog detail:", data);

        setBlog(data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching blog detail:", error);
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [blogId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-screen">
        Blog not found
      </div>
    );
  }

  const sectionData = sections?.find(
    (section) => section.type === "BlogDetail"
  );
  console.log("Section data:", sectionData);

  if (!sectionData) {
    return <div>No data available</div>;
  }
  console.log("Section data:", sectionData);

  return (
    <SectionBlogDetail $data={sectionData}>
      <div className="cover-image flex mx-auto items-center">
        <Image
          src={blog.image ? blog.image : "/assets/images/pro3.jpg"}
          alt={blog.title}
          fill
          className="object-cover"
        />
      </div>

      <h1 className="blog-title mb-6 mr-2">{blog.title}</h1>

      <div className="blog-content mr-2">{blog.content}</div>
      <div className="flex flex-col items-center gap-4 mb-8 mr-2">
        <span>{blog.authorId}نویسنده : </span>
        <span>
          {" "}
          {new Date(blog.createdAt || "").toLocaleDateString("fa-IR")}
        </span>
      </div>
    </SectionBlogDetail>
  );
};

export default BlogDetail;
