"use client";
import styled from "styled-components";
import { BlogListSection, BlogListSetting } from "@/lib/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface BlogListProps {
  sections: BlogListSection[];
  isMobile: boolean;
  componentName: string;
}
interface BlogData {
  blogId: number;
  imageSrc: string;
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

const BlogList: React.FC<BlogListProps> = ({ componentName, sections }) => {
  const [blogData, setBlogData] = useState<BlogData[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        console.log("data", data);

        const blogInfo = data.blogs.map((blog: BlogData) => ({
          ...blog,
          // btnText: "مطالعه بیشتر",
          btnLink: `/blog/${blog.blogId}`,
          imageSrc: "/assets/images/pro3.jpg", // Add a default image
          imageAlt: blog.title,
          description: blog.description,
          storeId: blog.storeId,
        }));
        setBlogData(blogInfo);
      } catch (error) {
        console.log("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const sectionData = sections.find(
    (section) => section.type === componentName
  );

  if (!sectionData) return null;

  return (
    <SectionBlogList dir="rtl" $data={sectionData}>
      {blogData.map((blog, index) => (
        <BlogCard key={`blog-${blog.id}-${index}`} $data={sectionData.setting}>
          {blog.imageSrc ? (
            <Image
              src={blog.imageSrc || "/assets/images/pro2.jpg"}
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
            <Link href={`/blog/${blog.id}`} className="read-more">
              مطالعه بیشتر
            </Link>
          </div>
        </BlogCard>
      ))}
    </SectionBlogList>
  );
};

export default BlogList;
