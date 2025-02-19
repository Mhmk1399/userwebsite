"use client";
import styled from "styled-components";
import { StorySection } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

interface StoryProps {
  sections: StorySection[];
  componentName: string;
}
interface Story {
  _id: string;
  title: string;
  image: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}
const StoryContainer = styled.div<{
  $data: StorySection;
}>`
  padding-top: ${(props) => props.$data.setting?.paddingTop || "0"}px;
  padding-bottom: ${(props) => props.$data.setting?.paddingBottom || "0"}px;
  margin-top: ${(props) => props.$data.setting?.marginTop || "0"}px;
  margin-bottom: ${(props) => props.$data.setting?.marginBottom || "0"}px;
  background-color: ${(props) =>
    props.$data.setting?.backgroundColor || "#ffffff"};
`;

const StoriesWrapper = styled.section`
  display: flex;
  direction: rtl;
  justify-content: center;
  overflow-x: auto;
  gap: 12px;
  padding: 10px;
  scroll-behavior: smooth;
  width: 100%;

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
  flex-shrink: 0; // Add this line
  // width: 80px; // Add fixed width (100px + 4px padding)

  .story-ring {
    padding: 2px;
    border-radius: 50%;
    border: 2px solid ${(props) => props.$data.blocks.setting.storyRingColor};
  }

  .story-image {
    border-radius: ${(props) => props.$data.blocks.setting.imageRadius}%;
    object-fit: cover;
  }

  .story-title {
    margin-top: 4px;
    font-size: ${(props) => props.$data.blocks.setting.titleFontSize}px;
    font-weight: ${(props) => props.$data.blocks.setting.titleFontWeight};
    color: ${(props) => props.$data.blocks.setting.titleColor};
    text-align: center;
  }
`;

export const Story: React.FC<StoryProps> = ({ sections, componentName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const sectionData = sections.find(
    (section) => section.type === componentName
  );

  useEffect(() => {
    const fetchAllStories = async () => {
      try {
        const response = await fetch("/api/story", {
          method: "GET",
        });
        const data = await response.json();
        setStories(data);
      } catch (error) {
        console.log("خطا در دریافت استوری‌ها", error);
      }
    };
    fetchAllStories();
  }, []);

  if (!sectionData) return null;

  return (
    <>
      <StoryContainer $data={sectionData} className="story-container">
        <StoriesWrapper
          ref={containerRef}
          className="overflow-x-auto scroll-smooth"
        >
          {(stories.length > 0 ? stories : sectionData.blocks.stories).map(
            (story, idx) => (
              <StoryItem
                key={"id" in story ? story.id + idx : idx}
                $data={sectionData}
                className=""
                onClick={() =>
                  setSelectedStory(
                    "image" in story ? story.image : story.imageUrl
                  )
                }
              >
                <div className="story-ring">
                  <Image
                    src={"/assets/images/pro1.jpg"}
                    alt={story.title}
                    className="story-image w-[60px] h-[60px] object-"
                    width={1000}
                    height={1000}
                  />
                </div>
                <span className="story-title">{story.title}</span>
              </StoryItem>
            )
          )}
        </StoriesWrapper>
      </StoryContainer>

      <AnimatePresence>
        {selectedStory && (
          <motion.div
            className="fixed w-full inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStory(null)}
          >
            <motion.div
              className="relative w-full max-w-lg "
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
