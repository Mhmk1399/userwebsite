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
  background-color: ${(props) =>
    props.$data.blocks.setting?.backgroundVideoSection || "#e4e4e4"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  gap: 15px;
  width: ${(props) => (props.$isMobile ? "425px" : "100%")};
`;

const Heading = styled.h1<{ $data: VideoSection; $isMobile: boolean }>`
  color: ${(props) => props.$data.blocks.setting?.headingColor || "#333"};
  font-size: ${(props) =>
    props.$isMobile
      ? "20"
      : props.$data.blocks?.setting?.headingFontSize || "24"}px;
  font-weight: ${(props) =>
    props.$data.blocks?.setting?.headingFontWeight || "bold"};
  text-align: center;
  padding: 0 ${(props) => (props.$isMobile ? "10" : "20")}px;
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const VideoElement = styled.video<{
  $data: VideoSection;
  $isMobile: boolean;
}>`
  width: ${(props) =>
    props.$isMobile
      ? "355px"
      : props.$data.blocks.setting?.videoWidth || "100%"};
  border-radius: ${(props) =>
    props.$data.blocks.setting?.videoRadious || "10px"}px;
  height: auto;
  padding: ${(props) => (props.$isMobile ? "0 10" : "10 30")}px;
`;

const Video: React.FC<VideoProps> = ({ sections, isMobile,componentName }) => {
  const sectionData = sections.find((section) => section.type === componentName);
  if (!sectionData) {
    return <div>No data available</div>;
  }

  const { blocks } = sectionData;

  return (
    <Section $data={sectionData} $isMobile={isMobile}>
      {blocks.heading && (
        <Heading $isMobile={isMobile} $data={sectionData}>
          {blocks.heading}
        </Heading>
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
