import Banner from "@/components/banner";
import SlideShow from "@/components/slideShow";
import RichText from "@/components/richText";
import ImageText from "@/components/imageText";
import Video from "@/components/video";
import ContactForm from "@/components/contactForm";
import NewsLetter from "@/components/newsLetter";
import CollapseFaq from "@/components/collapseFaq";
import MultiColumn from "@/components/multiColumn";
import MultiRow from "@/components/multiRow";
import { Collection } from "@/components/collection";
import Footer from "@/components/footer";

export default async function Page() {
  const getData = async () => {
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
        <RichText sections={sections} isMobile={isMobile} />
        <Banner sections={sections} isMobile={isMobile} />
        <SlideShow sections={sections} isMobile={isMobile} />
        <ImageText sections={sections} isMobile={isMobile} />
        <Video sections={sections} isMobile={isMobile} />
        <ContactForm sections={sections} isMobile={isMobile} />
        <NewsLetter sections={sections} isMobile={isMobile} />
        <CollapseFaq sections={sections} isMobile={isMobile} />
        <MultiColumn sections={sections} isMobile={isMobile} />
        <MultiRow sections={sections} isMobile={isMobile} />
        <Collection sections={sections} isMobile={isMobile} />
        <Footer sections={sections} isMobile={isMobile} />
      </>
    );
  } catch (error) {
    console.error("Error:", error);
    return <div>Error loading content</div>;
  }
}
