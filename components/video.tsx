"use client";
import styled from "styled-components";
import { VideoSection } from "@/lib/types";

interface VideoProps {
  sections: VideoSection[];
  isMobile: boolean;
  componentName: string;
}

const Section = styled.section<{ $data: VideoSection; $isMobile: boolean }>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || "10"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "10"}px;
  padding-left: ${(props) => props.$data.setting?.paddingLeft || "10"}px;
  padding-right: ${(props) => props.$data.setting?.paddingRight || "10"}px;
  margin-top: ${(props) => props.$data?.setting?.marginTop || "0"}px;
  margin-bottom: ${(props) => props.$data?.setting?.marginBottom || "0"}px;
  margin-left: ${(props) => props.$data?.setting?.marginLeft || "0"}px;
  margin-right: ${(props) => props.$data?.setting?.marginRight || "0"}px;
  background-color: ${(props) =>
    props.$data.blocks.setting?.backgroundVideoSection || "#e4e4e4"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  gap: 15px;
  min-width: max-content;
  box-shadow: ${(props) =>
    `${props.$data.blocks.setting.shadowOffsetX || 0}px 
     ${props.$data.blocks.setting.shadowOffsetY || 4}px 
     ${props.$data.blocks.setting.shadowBlur || 10}px 
     ${props.$data.blocks.setting.shadowSpread || 0}px 
     ${props.$data.blocks.setting.shadowColor || "#fff"}`};
`;

const Heading = styled.h1<{ $data: VideoSection; $isMobile: boolean }>`
  color: ${(props) => props.$data.blocks.setting?.headingColor || "#333"};
  font-size: ${(props) =>
    props.$data.blocks?.setting?.headingFontSize || "24"}px;
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.headingFontWeight || "bold"};
  text-align: center;
  padding: 0 ${(props) => (props.$isMobile ? "10" : "20")}px;
`;
const Desciption = styled.h2<{ $data: VideoSection; $isMobile: boolean }>`
  color: ${(props) => props.$data.blocks.setting?.descrptionColor || "#333"};
  font-size: ${(props) =>
    props.$data.blocks?.setting?.descrptionFontSize || "24"}px;
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.descrptionFontWeight || "bold"};
  text-align: center;
  padding: 0 ${(props) => (props.$isMobile ? "5" : "10")}px;
`;

const VideoElement = styled.video<{
  $data: VideoSection;
  $isMobile: boolean;
}>`
  width: ${(props) => props.$data.blocks.setting?.videoWidth || "100"}px;
  border-radius: ${(props) =>
    props.$data.blocks.setting?.videoRadious || "10px"}px;
  max-width: 100vw;
  height: ${(props) => props.$data.blocks.setting?.videoHeight || "100"}px;
`;

const Video: React.FC<VideoProps> = ({ sections, isMobile, componentName }) => {
  const sectionData = sections.find(
    (section) => section.type === componentName
  );
  if (!sectionData) return null;

  const { blocks } = sectionData;

  return (
    <Section $data={sectionData} $isMobile={isMobile}>
      {blocks.heading && (
        <Heading $isMobile={isMobile} $data={sectionData}>
          {blocks.heading}
        </Heading>
      )}
      {blocks.descrption && (
        <Desciption $data={sectionData} $isMobile={isMobile}>
          {blocks.descrption}
        </Desciption>
      )}

      {blocks.videoUrl && (
        <VideoElement
          $isMobile={isMobile}
          $data={sectionData}
          src={blocks.videoUrl}
          loop={blocks.setting?.videoLoop}
          muted={blocks.setting?.videoMute}
          autoPlay={blocks.setting?.videoAutoplay}
          poster={blocks.setting?.videoPoster}
          controls
        >
          {blocks.videoAlt && <track kind="captions" label={blocks.videoAlt} />}
        </VideoElement>
      )}
    </Section>
  );
};

export default Video;
