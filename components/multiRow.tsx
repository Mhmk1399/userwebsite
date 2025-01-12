"use client";
import { MultiRowSection, MultiRowBlock } from "@/lib/types";
import styled from "styled-components";

interface MultiRowShowProps {
  sections: MultiRowSection[];
  isMobile: boolean;
  componentName: string;
}

const Section = styled.section<{
  $data: MultiRowSection;
  $isMobile: boolean;
}>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || "20"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "20"}px;
  paddding-left: ${(props) => props.$data.setting?.paddingLeft || "0"}px;
  padding-right: ${(props) => props.$data.setting?.paddingRight || "0"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "20"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "20"}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorMultiRow || "#ffffff"};
  width: ${(props) => (props.$isMobile ? "auto" : "100%")};
  border-radius: 12px;
`;

const RowContainer = styled.div<{
  $isMobile: boolean;
}>`
  display: flex;
  flex-direction: column;
  items-center: center;
  justify-content: center;
  gap: ${(props) => (props.$isMobile ? "8px" : "16px")};
  padding: ${(props) => (props.$isMobile ? "10px" : "20px")};
`;

const Row = styled.div<{
  $data: MultiRowSection;
  $isMobile: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: ${(props) => (props.$isMobile ? "10px" : "20px")};
  padding: ${(props) => (props.$isMobile ? "15px" : "30px")};
  background-color: ${(props) =>
    props.$data.setting?.backgroundColorBox || "#f9f9f9"};
  border-radius: 18px;
  @media (max-width: 426px) {
    flex-direction: column;
  }
`;

const ContentWrapper = styled.div<{
  $data: MultiRowSection;
  $isMobile: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${(props) => (props.$isMobile ? "18px" : "16px")};
  width: ${(props) => (props.$isMobile ? "100%" : "60%")};
`;

const Image = styled.img<{
  $data: MultiRowSection;
  $isMobile: boolean;
}>`
  width: ${(props) =>
    props.$isMobile ? "100%" : props.$data.setting?.imageWidth}px;
  height: ${(props) =>
    props.$isMobile ? "200px" : props.$data.setting?.imageHeight}px;
  object-fit: cover;
  border-radius: ${(props) => props.$data.setting?.imageRadius || "8px"}px;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: scale(1.01);
    opacity: 0.7;
    cursor: pointer;
  }
`;

const Title = styled.h2<{
  $data: MultiRowSection;
  $isMobile: boolean;
}>`
  font-size: ${(props) =>
    props.$isMobile ? "24" : props.$data.setting?.titleFontSize || "24"}px;
  color: ${(props) => props.$data?.setting?.titleColor || "#ffffff"};
  text-align: center;
  margin-bottom: ${(props) => (props.$isMobile ? "10px" : "20px")};
`;

const Heading = styled.h2<{
  $data: MultiRowSection;
  $isMobile: boolean;
}>`
  color: ${(props) => props.$data.setting?.headingColor || "#333"};
  font-size: ${(props) =>
    props.$isMobile ? "22" : props.$data.setting?.headingFontSize || "24"}px;
  font-weight: ${(props) => props.$data.setting?.headingFontWeight || "bold"};
  text-align: center;
  @media (max-width: 768px) {
    font-size: 24px;
    margin-top: 10px;
  }
`;

const Description = styled.p<{
  $data: MultiRowSection;
  $isMobile: boolean;
}>`
  font-size: ${(props) =>
    props.$isMobile
      ? "14"
      : props.$data.setting?.descriptionFontSize || "16"}px;
  font-weight: ${(props) =>
    props.$data?.setting?.descriptionFontWeight || "normal"};
  color: ${(props) => props.$data.setting?.descriptionColor || "#666"};
  text-align: center;
  padding: ${(props) => (props.$isMobile ? "0 15" : "0 10")}px;
`;

const Button = styled.a<{
  $data: MultiRowSection;
  $isMobile: boolean;
}>`
  padding: ${(props) => (props.$isMobile ? "8px 20px" : "10px 30px")};
  font-size: ${(props) => (props.$isMobile ? "14px" : "16px")};
  background-color: ${(props) =>
    props.$data.setting?.btnBackgroundColor || "#007BFF"};
  color: ${(props) => props.$data.setting?.btnColor || "#fff"};
  border-radius: 5px;
  text-align: center;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const MultiRow: React.FC<MultiRowShowProps> = ({ sections, isMobile , componentName}) => {
  const sectionData = sections.find((section) => section.type === componentName);
  if (!sectionData) {
    return <div>No data available</div>;
  }
  return (
    <Section $isMobile={isMobile} $data={sectionData}>
      <Title $data={sectionData} $isMobile={isMobile}>
        {sectionData.title}
      </Title>

      <RowContainer $isMobile={isMobile}>
        {Object.entries(sectionData.blocks).map(([key, block], idx) => {
          if (key === "setting") return null;
          const typedBlock = block as MultiRowBlock;

          return (
            <Row key={idx} $data={sectionData} $isMobile={isMobile}>
              <Image
                $isMobile={isMobile}
                src={typedBlock.imageSrc || "/default-image.jpg"}
                alt={typedBlock.imageAlt || ""}
                $data={sectionData}
              />
              <ContentWrapper $isMobile={isMobile} $data={sectionData}>
                <Heading $isMobile={isMobile} $data={sectionData}>
                  {typedBlock.heading}
                </Heading>
                <Description $data={sectionData} $isMobile={isMobile}>
                  {typedBlock.description}
                </Description>
                <Button
                  href={typedBlock.btnLink || "#"}
                  $data={sectionData}
                  $isMobile={isMobile}
                >
                  {typedBlock.btnLable || "Learn More"}
                </Button>
              </ContentWrapper>
            </Row>
          );
        })}
      </RowContainer>
    </Section>
  );
};

export default MultiRow;
