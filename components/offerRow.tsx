"use client";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { OfferRowSection, ProductCardData } from "../lib/types";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OfferRowProps {
  sections: OfferRowSection[];
  isMobile: boolean;
  componentName: string;
}
const OffersContainer = styled.div<{
  $data: OfferRowSection;
  $isMobile: boolean;
}>`
  margin-top: ${(props) => props.$data.setting?.marginTop || "10"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "10"}px;
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20"}px;
  width: ${(props) => (props.$isMobile ? "100%" : "90%")};
  margin: ${(props) => (props.$isMobile ? "0 auto" : "0 auto")};
`;

const OffersWrapper = styled.section<{
  $data: OfferRowSection;
  $isMobile: boolean;
}>`
  display: flex;
  flex-direction: row;
  width: 100%;
  direction: rtl;
  justify-content: flex-center;
  align-items: center;
  overflow-x: auto;
  gap: ${(props) => (props.$isMobile ? "15px" : "30px")};
  padding: ${(props) => (props.$isMobile ? "4px" : "8px")};
  scroll-behavior: smooth;
  background: linear-gradient(
    to right,
    ${(props) => props.$data.setting?.gradientFromColor || "#e5e7eb"},
    ${(props) => props.$data.setting?.gradientToColor || "#d1d5db"}
  );
  border-radius: 0.75rem;
`;

const OfferItem = styled.div<{
  $data: OfferRowSection;
}>`
  display: flex;
  cursor: pointer;
  flex-direction: row;
  align-items: center;

  .offer-image {
    width: 80px;
    height: 80px;
    object-fit: cover;

    /* Apply image animations */
    ${(props) => {
      const imageAnimation = props.$data.blocks?.setting?.imageAnimation;
      if (!imageAnimation) return "";

      const { type, animation: animConfig } = imageAnimation;
      const selector = type === "hover" ? "&:hover" : "&:active";

      // Generate animation CSS based on type
      if (animConfig.type === "pulse") {
        return `
          ${selector} {
            animation: offerImagePulse ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes offerImagePulse {
            0%, 100% { 
              opacity: 1;
              filter: brightness(1);
            }
            50% { 
              opacity: 0.7;
              filter: brightness(1.3);
            }
          }
        `;
      } else if (animConfig.type === "glow") {
        return `
          ${selector} {
            animation: offerImageGlow ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes offerImageGlow {
            0%, 100% { 
              filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0));
            }
            50% { 
              filter: brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
            }
          }
        `;
      } else if (animConfig.type === "brightness") {
        return `
          ${selector} {
            animation: offerImageBrightness ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes offerImageBrightness {
            0%, 100% { 
              filter: brightness(1);
            }
            50% { 
              filter: brightness(1.4);
            }
          }
        `;
      } else if (animConfig.type === "blur") {
        return `
          ${selector} {
            animation: offerImageBlur ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes offerImageBlur {
            0%, 100% { 
              filter: blur(0px);
            }
            50% { 
              filter: blur(2px);
            }
          }
        `;
      } else if (animConfig.type === "saturate") {
        return `
          ${selector} {
            animation: offerImageSaturate ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes offerImageSaturate {
            0%, 100% { 
              filter: saturate(1);
            }
            50% { 
              filter: saturate(1.8);
            }
          }
        `;
      } else if (animConfig.type === "contrast") {
        return `
          ${selector} {
            animation: offerImageContrast ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes offerImageContrast {
            0%, 100% { 
              filter: contrast(1);
            }
            50% { 
              filter: contrast(1.5);
            }
          }
        `;
      } else if (animConfig.type === "opacity") {
        return `
          ${selector} {
            animation: offerImageOpacity ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes offerImageOpacity {
            0% { 
              opacity: 1;
            }
            50% { 
              opacity: 0.4;
            }
            100% { 
              opacity: 1;
            }
          }
        `;
      } else if (animConfig.type === "shadow") {
        return `
          ${selector} {
            animation: offerImageShadow ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes offerImageShadow {
            0%, 100% { 
              filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
            }
            50% { 
              filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
            }
          }
        `;
      }

      return "";
    }}
  }

  .discount-badge {
    background: #ef394e;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 14px;
  }
`;

const ViewAllButton = styled.button<{
  $data: OfferRowSection;
}>`
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  font-size: 1.125rem;
  margin-right: auto;
  font-weight: 600;
  display: none;

  &:hover {
    opacity: 0.65;
  }

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: row-reverse;
    gap: 0.5rem;
    align-items: center;
  }

  /* Apply button animations */
  ${(props) => {
    const buttonAnimation = props.$data.blocks?.setting?.buttonAnimation;
    if (!buttonAnimation) return "";

    const { type, animation: animConfig } = buttonAnimation;
    const selector = type === "hover" ? "&:hover" : "&:active";

    // Generate animation CSS based on type
    if (animConfig.type === "pulse") {
      return `
        ${selector} {
          animation: offerButtonPulse ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes offerButtonPulse {
          0%, 100% { 
            opacity: 1;
            filter: brightness(1);
          }
          50% { 
            opacity: 0.7;
            filter: brightness(1.3);
          }
        }
      `;
    } else if (animConfig.type === "glow") {
      return `
        ${selector} {
          animation: offerButtonGlow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes offerButtonGlow {
          0%, 100% { 
            filter: brightness(1) drop-shadow(0 0 0px rgba(255, 255, 255, 0));
          }
          50% { 
            filter: brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
          }
        }
      `;
    } else if (animConfig.type === "brightness") {
      return `
        ${selector} {
          animation: offerButtonBrightness ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes offerButtonBrightness {
          0%, 100% { 
            filter: brightness(1);
          }
          50% { 
            filter: brightness(1.4);
          }
        }
      `;
    } else if (animConfig.type === "blur") {
      return `
        ${selector} {
          animation: offerButtonBlur ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes offerButtonBlur {
          0%, 100% { 
            filter: blur(0px);
          }
          50% { 
            filter: blur(2px);
          }
        }
      `;
    } else if (animConfig.type === "saturate") {
      return `
        ${selector} {
          animation: offerButtonSaturate ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes offerButtonSaturate {
          0%, 100% { 
            filter: saturate(1);
          }
          50% { 
            filter: saturate(1.8);
          }
        }
      `;
    } else if (animConfig.type === "contrast") {
      return `
        ${selector} {
          animation: offerButtonContrast ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes offerButtonContrast {
          0%, 100% { 
            filter: contrast(1);
          }
          50% { 
            filter: contrast(1.5);
          }
        }
      `;
    } else if (animConfig.type === "opacity") {
      return `
        ${selector} {
          animation: offerButtonOpacity ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes offerButtonOpacity {
          0% { 
            opacity: 1;
          }
          50% { 
            opacity: 0.4;
          }
          100% { 
            opacity: 1;
          }
        }
      `;
    } else if (animConfig.type === "shadow") {
      return `
        ${selector} {
          animation: offerButtonShadow ${animConfig.duration} ${
        animConfig.timing
      } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
        }
        
        @keyframes offerButtonShadow {
          0%, 100% { 
            filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
          }
          50% { 
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          }
        }
      `;
    }

    return "";
  }}
`;

export const OfferRow: React.FC<OfferRowProps> = ({
  sections,
  isMobile,
  componentName,
}) => {
  const [offerProducts, setOfferProducts] = useState<ProductCardData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const sectionData = sections.find(
    (section) => section.type === componentName
  );

  if (!sectionData) return null;

  const CollectionId = sectionData?.blocks.setting.selectedCollection;

  useEffect(() => {
    if (!sectionData) return;

    const fetchOffers = async () => {
      try {
        const response = await fetch("/api/collection", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            CollectionId: CollectionId || "", // Remove extra quotes
          },
        });
        const data = await response.json();
        if (data.products) {
          setOfferProducts(data.products);
        }
      } catch (error) {
        console.log("Error fetching offers:", error);
      }
    };
    fetchOffers();
  }, [CollectionId, sectionData]);

  if (!sectionData) return null;
  return (
    <OffersContainer $data={sectionData} $isMobile={isMobile}>
      <OffersWrapper
        ref={containerRef}
        $data={sectionData}
        $isMobile={isMobile}
      >
        <div className="flex items-center justify-start ">
          <Image
            src={"/assets/images/fresh.webp"}
            alt="Offer"
            width={50}
            height={50}
          />
          <h2
            className="text-lg font-bold lg:text-2xl lg:w-1/4 w-full text-nowrap"
            style={{
              color: sectionData.blocks.setting?.titleColor || "#059669",
            }}
          >
            {sectionData.blocks.setting?.titleText}
          </h2>
        </div>
        <div className="flex flex-wrap mr-2 items-center justify-center gap-4">
          {offerProducts.map((product) => (
            <OfferItem
              key={product._id}
              className="relative"
              $data={sectionData}
            >
              <Image
                src={"/assets/images/placeholder.jpg"}
                alt={product.name}
                width={80}
                height={80}
                className="offer-image rounded-full"
              />
              <span className="discount-badge bottom-0 text-xs absolute">
                {product.discount}%
              </span>
            </OfferItem>
          ))}
          <button
            onClick={() => router.push(`/collection/${CollectionId}`)}
            className="rounded-full px-4 py-2 my-4 text-lg mr-auto font-semibold lg:hidden flex flex-row-reverse gap-x-2 items-center"
            style={{
              background: sectionData.blocks.setting?.buttonColor || "#ffffff",
              color: sectionData.blocks.setting?.buttonTextColor || "#000000",
            }}
          >
            <svg
              fill={sectionData.blocks.setting?.buttonTextColor || "#000000"}
              xmlns="http://www3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              aria-label="offer-button"
            >
              <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
            </svg>
          </button>
        </div>
        {isMobile && (
          <ViewAllButton
            $data={sectionData}
            style={{
              background: sectionData.blocks.setting?.buttonColor || "#ffffff",
              color: sectionData.blocks.setting?.buttonTextColor || "#000000",
            }}
          >
            <svg
              fill={sectionData.blocks.setting?.buttonTextColor || "#000000"}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
            >
              <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
            </svg>
            <Link href={"/collections"}>
              {sectionData.blocks?.setting?.buttonText || "مشاهده همه"}
            </Link>
          </ViewAllButton>
        )}
      </OffersWrapper>
    </OffersContainer>
  );
};
