"use client";
import styled from "styled-components";
import { StorySection } from "@/lib/types";
import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

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
  justify-content: center;
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
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const sectionData = sections.find((section) => section.type === componentName);

  if (!sectionData) return null;

  return (
    <>
      <StoryContainer $data={sectionData}>
        <StoriesWrapper ref={containerRef}>
          {sectionData.blocks.stories.map((story) => (
            <StoryItem 
              key={story.id} 
              $data={sectionData}
              onClick={() => setSelectedStory(story.imageUrl)}
            >
              <div className="story-ring">
                <Image 
                  src={story.imageUrl} 
                  alt={story.title} 
                  className="story-image w-[100px] h-[100px] object-"
                  width={100}
                  height={100}
                />
              </div>
              <span className="story-title">{story.title}</span>
            </StoryItem>
          ))}
        </StoriesWrapper>
      </StoryContainer>
      
      <AnimatePresence>

{selectedStory && (
  <motion.div 
    className="fixed w-fit inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm "
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={() => setSelectedStory(null)}
  >
    <motion.div
      className="relative w-fit max-w-lg  "
      initial={{ scale: 0.8, y: 100 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.8, y: 100 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute -top-20 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white text-2xl hover:bg-white/30 transition-all"
        onClick={() => setSelectedStory(null)}
      >
        ×
      </button>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full h-full"
      >
        <Image
          src={selectedStory}
          alt="Story view"
          width={400}
          height={896}
          className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
        />
      </motion.div>
    </motion.div>
  </motion.div>
)}

      </AnimatePresence>
    </>
  );
};