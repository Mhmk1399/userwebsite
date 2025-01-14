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

const BlogList: React.FC<BlogListProps> = ({  sections, componentName }) => {
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
        console.log("Blogs:", data);

        setBlogs(Array.isArray(data.blogs) ? data.blogs : [data.blogs]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const sectionData = sections?.find((section) => section.type === componentName);

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
              height={800}
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

            <Link href={`/blogs/${blog._id}`} className="read-more">
              {blog.btnText || "مطالعه بیشتر"}
            </Link>
          </div>
        </BlogCard>
      ))}
    </SectionBlogList>
  );
};

export default BlogList;
