"use client";
import styled from "styled-components";
import { useRef } from "react";
import Image from "next/image";
import { OfferRowSection } from "../lib/types";


interface OfferRowProps {
  sections: OfferRowSection[];
  isMobile: boolean;
  componentName: string;
}

const OffersContainer = styled.div<{
  $data: OfferRowSection;
  $isMobile: boolean;
}>`
  margin-top: ${props => props.$data.setting?.marginTop || "10"}px;
  margin-bottom: ${props => props.$data.setting?.marginBottom || "10"}px;
  padding-top: ${props => props.$data.setting?.paddingTop || "20"}px;
  padding-bottom: ${props => props.$data.setting?.paddingBottom || "20"}px;
  width: ${props => props.$isMobile ? '100%' : '90%'};
  margin: ${props => props.$isMobile ? '0 auto' : '0 auto'};
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
  gap: ${props => props.$isMobile ? '15px' : '30px'};
  padding: ${props => props.$isMobile ? '4px' : '8px'};
  scroll-behavior: smooth;
  background: linear-gradient(to right, 
    ${props => props.$data.setting?.gradientFromColor || '#e5e7eb'}, 
    ${props => props.$data.setting?.gradientToColor || '#d1d5db'}
  );
  border-radius: 0.75rem;
`;


const OfferItem = styled.div`
  display: flex;
  cursor: pointer;
  flex-direction: row;
  align-items: center;

  .offer-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }

  .discount-badge {
    background: #ef394e;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 14px;
  }
`;

export const OfferRow: React.FC<OfferRowProps> = ({ sections, isMobile, componentName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionData = sections.find((section) => section.type === componentName);

  if (!sectionData) return null;

  const offers = [
    {
      id: 2,
      title: "برنج طبیعت",
      imageUrl: "/assets/images/pro1.jpg",
      price: 450000,
      originalPrice: 520000,
      discount: 15,
    },
    {
      id: 3,
      title: "برنج طبیعت",
      imageUrl: "/assets/images/pro1.jpg",
      price: 450000,
      originalPrice: 520000,
      discount: 15,
    },
    {
      id: 4,
      title: "برنج طبیعت",
      imageUrl: "/assets/images/pro1.jpg",
      price: 450000,
      originalPrice: 520000,
      discount: 15,
    },
    {
      id: 5,
      title: "برنج طبیعت",
      imageUrl: "/assets/images/pro1.jpg",
      price: 450000,
      originalPrice: 520000,
      discount: 15,
    },
    {
      id: 6,
      title: "برنج طبیعت",
      imageUrl: "/assets/images/pro1.jpg",
      price: 450000,
      originalPrice: 520000,
      discount: 15,
    }
  ];

  return (
    <OffersContainer $data={sectionData} $isMobile={isMobile}>
      <OffersWrapper  ref={containerRef} $data={sectionData} $isMobile={isMobile}>
        <div className="flex items-center justify-start ">
          <Image src={"/assets/images/fresh.webp"} alt="Offer" width={50} height={50} />
          <h2
            className="text-lg font-bold lg:text-2xl lg:w-1/4 w-full text-nowrap"
            style={{ color: sectionData.blocks.setting?.titleColor || '#059669' }}
          >
            {sectionData.blocks.setting?.titleText}
          </h2>
        </div>
        <div className="flex flex-wrap mr-2 items-center justify-center gap-4">
          {offers.map((offer) => (
            <OfferItem key={offer.id} className="relative">
              <Image
                src={offer.imageUrl}
                alt={offer.title}
                width={80}
                height={80}
                className="offer-image rounded-full "
              />
              <span className="discount-badge bottom-0 text-xs absolute">{offer.discount}%</span>
            </OfferItem>
          ))}
          <button className="lg:hidden bg-white rounded-full px-4 py-2 my-4 mr-8 text-lg items-center">
            <svg
              fill={sectionData.blocks.setting?.buttonTextColor || '#000000'}
              xmlns="http://www3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
            >
              <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
            </svg>
          </button>
        </div>
        <button
          className="rounded-full px-4 py-2 my-4 text-lg mr-auto font-semibold hidden lg:flex flex-row-reverse gap-x-2 items-center"
          style={{ 
            background: sectionData.blocks.setting?.buttonColor || '#ffffff', 
            color: sectionData.blocks.setting?.buttonTextColor || '#000000' 
          }}
        >
          <svg
            fill={sectionData.blocks.setting?.buttonTextColor || '#000000'}
            xmlns="http://www3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
          >
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
          </svg>
          {sectionData.setting?.buttonText || 'مشاهده همه'}
        </button>
      </OffersWrapper>
    </OffersContainer>
  );
};
