"use client";
import styled from "styled-components";
import { StorySection } from "@/lib/types";
import { useRef } from "react";
import Image from "next/image";

interface StoryProps {
  sections: StorySection[];
  componentName: string;
}

const StoryContainer = styled.div<{
  $data: StorySection;
}>`
  width: 100%;
  padding-top: ${props => props.$data.setting?.paddingTop || "20"}px;
  padding-bottom: ${props => props.$data.setting?.paddingBottom || "20"}px;
  margin-top: ${props => props.$data.setting?.marginTop || "10"}px;
  margin-bottom: ${props => props.$data.setting?.marginBottom || "10"}px;
  background-color: ${props => props.$data.setting?.backgroundColor || "#ffffff"};
`;

const StoriesWrapper = styled.section`
  display: flex;
  overflow-x: scroll;
  gap: 12px;
  padding: 10px;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const StoryItem = styled.div<{
  $data: StorySection;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  .story-ring {
    padding: 2px;
    border-radius: 50%;
    border: 2px solid ${props => props.$data.blocks.setting.storyRingColor};
  }

  .story-image {
    width: ${props => props.$data.blocks.setting.imageWidth}px;
    height: ${props => props.$data.blocks.setting.imageHeight}px;
    border-radius: ${props => props.$data.blocks.setting.imageRadius}%;
    object-fit: cover;
  }

  .story-title {
    margin-top: 4px;
    font-size: ${props => props.$data.blocks.setting.titleFontSize}px;
    font-weight: ${props => props.$data.blocks.setting.titleFontWeight};
    color: ${props => props.$data.blocks.setting.titleColor};
    text-align: center;
  }
`;

export const Story: React.FC<StoryProps> = ({ sections, componentName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionData = sections.find((section) => section.type === componentName);

  if (!sectionData) {
    return null;
  }

  return (
    <StoryContainer $data={sectionData}>
      <StoriesWrapper ref={containerRef}>
        {sectionData.blocks.stories.map((story) => (
          <StoryItem 
            key={story.id} 
            $data={sectionData}
          >
            <div className="story-ring">
              <Image 
                src={story.imageUrl} 
                alt={story.title} 
                className="story-image"
                width={200}
                height={200}
              />
            </div>
            <span className="story-title">{story.title}</span>
          </StoryItem>
        ))}
      </StoriesWrapper>
    </StoryContainer>
  );
};
