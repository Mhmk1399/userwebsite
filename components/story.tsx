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

    /* Apply story image animations */
    ${(props) => {
      const imageAnimation = props.$data.blocks?.setting?.imageAnimation;
      if (!imageAnimation) return "";

      const { type, animation: animConfig } = imageAnimation;
      const selector = type === "hover" ? "&:hover" : "&:active";

      // Generate animation CSS based on type
      if (animConfig.type === "pulse") {
        return `
          ${selector} {
            animation: storyImagePulse ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes storyImagePulse {
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
            animation: storyImageGlow ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes storyImageGlow {
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
            animation: storyImageBrightness ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes storyImageBrightness {
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
            animation: storyImageBlur ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes storyImageBlur {
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
            animation: storyImageSaturate ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes storyImageSaturate {
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
            animation: storyImageContrast ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes storyImageContrast {
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
            animation: storyImageOpacity ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes storyImageOpacity {
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
            animation: storyImageShadow ${animConfig.duration} ${
          animConfig.timing
        } ${animConfig.delay || "0s"} ${animConfig.iterationCount || "1"};
          }
          
          @keyframes storyImageShadow {
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
