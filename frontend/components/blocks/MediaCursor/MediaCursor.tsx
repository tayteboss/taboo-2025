import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { SiteSettingsType } from "../../../shared/types/types";
import { useMousePosition } from "../../../hooks/useMousePosition";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const MediaCursorWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  pointer-events: none;
`;

const AnimatedImageContainer = styled(motion.div)`
  position: absolute;
  width: 230px;
  height: 288px;
  will-change: transform, opacity;
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
`;

type Props = {
  data: SiteSettingsType["footerMedia"];
};

type DroppedImage = {
  id: number;
  relativeX: number;
  relativeY: number;
  src: string;
};

// --- Constants ---
const IMAGE_LIFESPAN_MS = 1000;
const FADE_DURATION_S = 0.3;
const MIN_DISTANCE_THRESHOLD = 50;

// --- The Component ---
const MediaCursor = (props: Props) => {
  const { data } = props;
  const position = useMousePosition();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageIndexRef = useRef(0);

  const prevRelativePositionRef = useRef({ x: 0, y: 0 });
  const lastDropRelativePositionRef = useRef({ x: 0, y: 0 });

  const [droppedImages, setDroppedImages] = useState<DroppedImage[]>([]);

  const addImage = useCallback(
    (relativeX: number, relativeY: number) => {
      if (!data || !Array.isArray(data) || data.length === 0) {
        return;
      }

      const currentIndex = imageIndexRef.current;
      const imageSource = data[currentIndex]?.asset?.url;

      if (!imageSource) {
        imageIndexRef.current = 0; // Reset index if source invalid
        return;
      }

      const newImage: DroppedImage = {
        id: Date.now() + Math.random(),
        relativeX: relativeX, // Store relative position
        relativeY: relativeY, // Store relative position
        src: imageSource,
      };

      setDroppedImages((prevImages) => [...prevImages, newImage]);
      imageIndexRef.current = (currentIndex + 1) % data.length;

      setTimeout(() => {
        setDroppedImages((currentImages) =>
          currentImages.filter((img) => img.id !== newImage.id)
        );
      }, IMAGE_LIFESPAN_MS);
    },
    [data]
  );

  // Effect to track mouse movement and trigger image drops
  useEffect(() => {
    const globalX = position.x;
    const globalY = position.y;
    const wrapperElement = wrapperRef.current;

    // Need valid global coordinates AND the wrapper element ref
    if (globalX === null || globalY === null || !wrapperElement) {
      return;
    }

    // Get the bounding box of the parent element
    const wrapperRect = wrapperElement.getBoundingClientRect();

    // Calculate mouse position relative to the wrapper element
    // Adjusting for scroll position is important if the page scrolls
    const relativeX = globalX - wrapperRect.left; // + wrapperElement.scrollLeft; // Add scrollLeft if wrapper can scroll horizontally
    const relativeY = globalY - wrapperRect.top; // + wrapperElement.scrollTop; // Add scrollTop if wrapper can scroll vertically

    // Calculate distance moved *relative* to the wrapper since last drop
    const dropDeltaX = relativeX - lastDropRelativePositionRef.current.x;
    const dropDeltaY = relativeY - lastDropRelativePositionRef.current.y;
    const distanceSinceLastDrop = Math.sqrt(
      dropDeltaX * dropDeltaX + dropDeltaY * dropDeltaY
    );

    // Check if mouse moved significantly within the wrapper
    if (distanceSinceLastDrop > MIN_DISTANCE_THRESHOLD) {
      // Add image using *relative* coordinates
      // Center the image on the cursor by offsetting half its width/height
      const centerX = relativeX - 230 / 2; // Half of image width
      const centerY = relativeY - 288 / 2; // Half of image height
      addImage(centerX, centerY);
      lastDropRelativePositionRef.current = { x: relativeX, y: relativeY };
    }

    // Update previous *relative* position for the next frame's distance calculation
    prevRelativePositionRef.current = { x: relativeX, y: relativeY };
  }, [position, addImage]); // Re-run when global position changes

  // We don't need a separate init effect for refs anymore,
  // the main effect handles the checks properly.

  return (
    // Assign the ref to the wrapper div
    <MediaCursorWrapper ref={wrapperRef}>
      <AnimatePresence>
        {droppedImages.map((image) => (
          <AnimatedImageContainer
            key={image.id}
            initial={{
              // Start at the calculated relative position
              x: image.relativeX,
              y: image.relativeY,
              opacity: 0.7,
              scale: 0.8,
            }}
            animate={{
              // Animate to the same relative position (or adjust if needed)
              x: image.relativeX,
              y: image.relativeY,
              opacity: 1,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 20,
                mass: 0.5,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              transition: {
                duration: FADE_DURATION_S,
                ease: "easeOut",
              },
            }}
            // Framer motion's x/y props handle positioning absolutely
            style={{ top: 0, left: 0 }}
          >
            <ImageWrapper>
              <Image
                src={image.src}
                alt="Cursor Trail Image"
                fill
                priority
                style={{
                  objectFit: "cover",
                }}
                sizes={"230px"}
              />
            </ImageWrapper>
          </AnimatedImageContainer>
        ))}
      </AnimatePresence>
    </MediaCursorWrapper>
  );
};

export default MediaCursor;
