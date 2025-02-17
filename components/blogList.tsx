"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { BlogListSection, BlogListSetting } from "@/lib/types";
import Image from "next/image";

interface BlogData {
  blogId: number;
  imageSrc: string;
  imageAlt: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  btnText: string;
  btnLink: string;
  _id: string;
}
interface BlogListProps {
  sections: BlogListSection[];
  isMobile: boolean;
  componentName: string;
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
  margin-top: ${(props) => props.$data?.setting?.marginTop}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom}px;
  background-color: ${(props) => props.$data?.setting?.backgroundColor};

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
    font-size: 1.25rem;
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
    color: #000000;
    margin-bottom: 15px;
    color: ${(props) => props.$data?.textColor};
  }

  .read-more {
    display: inline-block;
    padding: 8px 16px;
    background: #0070f3;
    color: ${(props) => props.$data?.buttonColor};
    border-radius: 4px;
    text-decoration: none;
    transition: background 0.3s ease;
    background: ${(props) => props.$data?.btnBackgroundColor};

    &:hover {
      opacity: 0.8;
    }
  }
`;

const BlogList: React.FC<BlogListProps> = ({ sections, componentName }) => {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blog");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        console.log(data , "bbbbbbbbb")
        // Handle null blogs response
        setBlogs(
          data.blogs
            ? Array.isArray(data.blogs)
              ? data.blogs
              : [data.blogs]
            : []
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);
  if (!blogs || blogs.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-white">
        <div className=" mb-6">
          <svg
            className="w-24 h-24 text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          !!هنوز مطلبی منتشر نشده
        </h3>
        <p className="text-gray-600 text-center max-w-md mb-6">
          به زودی با مطالب جذاب و خواندنی برمیگردیم
        </p>
        <div className="relative">
          <div className="absolute inset-0  bg-gradient-to-r from-blue-50 to-indigo-50 blur-lg opacity-30 animate-pulse"></div>
          <Link
            href="/"
            className="relative px-6 py-3 bg-white border border-blue-300 text-indigo-600 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    );
  }
  const sectionData = sections?.find(
    (section) => section.type === componentName
  );

  if (!sectionData) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  console.log("Section data:", sectionData);

  if (!sectionData) {
    return null;
  }

  return (
    <SectionBlogList dir="rtl" $data={sectionData}>
      {blogs.map((blog, index) => (
        // Inside BlogCard component:
        <BlogCard
          key={`blog-${blog.blogId}-${index}`}
          $data={sectionData.setting}
        >
          {blog.imageSrc ? (
            <Image
              src={blog.imageSrc || "/assets/images/pro2.jpg"}
              alt={blog.imageAlt || "Blog image"}
              width={1000}
              height={1000}
            />
          ) : null}
          <div className="content text-right">
            <h2 className="title">{blog.title}</h2>

            {/* Display any text content available */}
            {blog.content && (
              <p
                className="description mb-2"
                dangerouslySetInnerHTML={{
                  __html: blog.content.substring(0, 30) + "...",
                }}
              />
            )}
            <div className="meta">
              {/* Display all available author info */}
              <span> نویسنده : {blog.authorId} </span>
              <span>
                {new Date(blog?.createdAt || "").toLocaleDateString("fa-IR")}
              </span>
            </div>

            <Link href={`/blog/${blog._id}`} className="read-more">
              {blog.btnText || "مطالعه بیشتر"}
            </Link>
          </div>
        </BlogCard>
      ))}
    </SectionBlogList>
  );
};

export default BlogList;
