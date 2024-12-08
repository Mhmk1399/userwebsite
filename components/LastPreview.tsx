"use client";
import { 
  BlogSection,
  CollectionSection,
  ContactFormDataSection,
  FooterSection,
  MultiRowSection,
  ProductSection,
  SlideSection,
  VideoSection,
  BannerSection,
  HeaderSection,
  ImageTextSection,
  MultiColumnSection,
  NewsLetterSection,
  RichTextSection,} from "@/lib/types";
import Link from "next/link";
import { useState, useEffect } from "react";

interface LastPreviewProps {
  sections: {
    banners: BannerSection[];
    slideshows: SlideSection[];
    RichText: RichTextSection[];
    ImageText:ImageTextSection[];
    Video:VideoSection[];
    ContactForm:ContactFormDataSection[];
    NewsLetter:NewsLetterSection[];
    MultiColumn:MultiColumnSection[];
    MultiRow:MultiRowSection[];
    Footer:FooterSection[];
    Header:HeaderSection[];
    Collection:CollectionSection[];
    Product:ProductSection[];
    Blog:BlogSection[];
    
    

    // Add other section arrays as needed
  };
}

export default function LastPreview({ sections }: LastPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Add these functions inside your component
  const handleNext = (totalSlides: number) =>
    setCurrentIndex((prev) => (prev + 1) % totalSlides);

  const handlePrev = (totalSlides: number) =>
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  return (
    <div>
      {/* Render Banner Sections */}
      {sections.banners.map((banner, index) => (
        <div
          key={index}
          style={{
            position: "relative",
            height: "600px",
            margin: "0 10px",
            paddingTop: `${banner.setting.paddingTop}px`,
            paddingBottom: `${banner.setting.paddingBottom}px`,
            marginTop: `${banner.setting.marginTop}px`,
            marginBottom: `${banner.setting.marginBottom}px`,
          }}
        >
          <Link
            href={banner.blocks.imageLink || "/"}
            style={{
              position: "relative",
              display: "block",
              width: "100%",
              height: "100%",
            }}
          >
            <img
              src={banner.blocks.imageSrc}
              alt={banner.blocks.imageAlt}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                opacity: banner.blocks.setting.opacityImage,
                borderRadius: banner.blocks.setting.imageRadious,
                objectFit: banner.blocks.setting.imageBehavior as any,
              }}
            />
          </Link>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "50px 200px",
              backgroundColor: banner.blocks.setting.backgroundColorBox,
              borderRadius: banner.blocks.setting.backgroundBoxRadious,
              opacity: banner.blocks.setting.opacityTextBox || 1,
            }}
          >
            <h2
              style={{
                color: banner.blocks.setting.textColor,
                fontSize: `${banner.blocks.setting.textFontSize}px`,
                fontWeight: banner.blocks.setting.textFontWeight,
                textAlign: "center",
              }}
            >
              {banner.blocks.text}
            </h2>
            <p
              style={{
                color: banner.blocks.setting.descriptionColor,
                fontSize: `${banner.blocks.setting.descriptionFontSize}px`,
                fontWeight: banner.blocks.setting.descriptionFontWeight,
                marginTop: "14px",
                textAlign: "center",
              }}
            >
              {banner.blocks.description}
            </p>
          </div>
        </div>
      ))}

      {/* Render SlideShow Sections */}
      {sections.slideshows.map((slideshow, index) => (
        <div
          key={index}
          style={{
            position: "relative",
            margin: "0px 10px",
            paddingTop: `${slideshow.setting.paddingTop}px`,
            paddingBottom: `${slideshow.setting.paddingBottom}px`,
            marginTop: `${slideshow.setting.marginTop}px`,
            marginBottom: `${slideshow.setting.marginBottom}px`,
            backgroundColor: slideshow.setting.backgroundColorBox,
            borderRadius: slideshow.setting.backgroundBoxRadius,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "800px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                transition: "transform 0.6s ease-in-out",
                transform: `translateX(${currentIndex * -100}%)`,
              }}
            >
              {slideshow.blocks.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  style={{
                    flex: "0 0 100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    style={{
                      width: `${slideshow.setting.imageWidth}px`,
                      height: `${slideshow.setting.imageHeight}px`,
                      opacity: slideshow.setting.opacityImage,
                      borderRadius: slideshow.setting.imageRadious,
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    <h2
                      style={{
                        color: slideshow.setting.textColor,
                        fontSize: `${slideshow.setting.textFontSize}px`,
                        fontWeight: slideshow.setting.textFontWeight,
                        marginTop: "5px",
                        textAlign: "center",
                      }}
                    >
                      {slide.text}
                    </h2>
                    <p
                      style={{
                        color: slideshow.setting.descriptionColor,
                        fontSize: slideshow.setting.descriptionFontSize,
                        fontWeight: slideshow.setting.descriptionFontWeight,
                        padding: "20px",
                        textAlign: "center",
                        marginTop: "5px",
                      }}
                    >
                      {slide.description}
                    </p>
                    <button
                      style={{
                        color: slideshow.setting.btnTextColor,
                        backgroundColor: slideshow.setting.btnBackgroundColor,
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {slide.btnText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Navigation Buttons */}
            <button
              style={{
                position: "absolute",
                top: "50%",
                left: "5px",
                transform: "translateY(-250%)",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "20%",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              {"<"}
            </button>
            <button
              style={{
                position: "absolute",
                top: "50%",
                right: "5px",
                transform: "translateY(-250%)",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "20%",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              {">"}
            </button>
          </div>
        </div>
      ))}



    </div>
  );
}
