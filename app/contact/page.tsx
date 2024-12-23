import ImageText from "@/components/imageText";
import ContactForm from "@/components/contactForm";
import NewsLetter from "@/components/newsLetter";

export default async function Page() {
  const getData = async () => {
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not set");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/sections`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return response.json();
  };

  try {
    const { sections, isMobile } = await getData();

    return (
      <>
        <ImageText sections={sections} isMobile={isMobile} />
        <ContactForm sections={sections} isMobile={isMobile} />
        <NewsLetter sections={sections} isMobile={isMobile} />
      </>
    );
  } catch (error) {
    console.error("Error:", error);
    return <div>Error loading content</div>;
  }
}
