
interface BlogSchemaProps {
    title: string;
    url: string;
    images: string[];
    sections: {
      heading: string;
      content: string;
      images?: string[];
      lists?: string[];
    }[];
  }
  
  export function generateBlogSchema(blogData: BlogSchemaProps) {
    
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "PathName",
      },
      headline: blogData.title,
      image: blogData.images,
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      author: {
        "@type": "Organization",
        name: "Tomak",
        url: "PathName",
      },
      publisher: {
        "@type": "Organization",
        name: "Tomak",
        logo: {
          "@type": "ImageObject",
          url: "PathName",
        },
      },
      articleBody: blogData.sections.map(section => ({
        heading: section.heading,
        content: section.content,
        ...(section.lists && { lists: section.lists }),
        ...(section.images && { images: section.images })
      }))
    }
  }
  
  