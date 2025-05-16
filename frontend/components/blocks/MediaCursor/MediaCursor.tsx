import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo, // Import memo
} from "react";
import styled from "styled-components";
import { SiteSettingsType } from "../../../shared/types/types";
import { useMousePosition } from "../../../hooks/useMousePosition";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// --- Styled Components ---

const MediaCursorWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  pointer-events: none; // Important: Allows clicks to pass through
  overflow: hidden; // Prevent images popping out if calculations are slightly off
`;

const AnimatedImageContainer = styled(motion.div)`
  position: absolute; // Positioned by framer-motion x/y
  top: 0; // Set base position
  left: 0; // Set base position
  width: 10vw;
  will-change: transform, opacity; // Hint browser about animations
  pointer-events: none; // Ensure container itself doesn't block interactions
`;

const ImageWrapper = styled.div`
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  padding-top: 120%;
  border-radius: 8px;
  overflow: hidden;
`;

const DifferenceReveal = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  mix-blend-mode: difference;
  z-index: 5;
  pointer-events: none;
`;

// --- Prop Types ---
type Props = {
  data: SiteSettingsType["footerMedia"]; // Expecting stable prop reference from parent
};

// --- Dropped Image Type ---
type DroppedImage = {
  id: number; // Unique key for React list rendering
  relativeX: number; // X position relative to the wrapper
  relativeY: number; // Y position relative to the wrapper
  src: string; // Image source URL
};

// --- Constants ---
const IMAGE_LIFESPAN_MS = 1500; // How long image stays visible
const FADE_DURATION_S = 0.1; // Exit fade duration
const MIN_DISTANCE_THRESHOLD = 10; // Pixels mouse must move to drop new image
const IMAGE_WIDTH = 230;
const IMAGE_HEIGHT = 288;

// --- The Component ---
// Wrap component in React.memo for performance optimization
const MediaCursor = memo((props: Props) => {
  const { data } = props;
  const position = useMousePosition(); // Optimized hook assumed
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageIndexRef = useRef(0); // Tracks next image index

  // Refs to store positions without causing re-renders
  const lastDropRelativePositionRef = useRef({ x: 0, y: 0 });

  const [droppedImages, setDroppedImages] = useState<DroppedImage[]>([]);

  // Memoized function to add images
  const addImage = useCallback(
    (relativeX: number, relativeY: number) => {
      // Guard clause: ensure data is a valid array with content
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn("MediaCursor: No valid image data provided.");
        return;
      }

      const currentIndex = imageIndexRef.current;
      const imageSource = data[currentIndex]?.asset?.url;

      // Ensure the selected image source is valid
      if (!imageSource) {
        console.warn(
          `MediaCursor: Invalid image source at index ${currentIndex}. Resetting index.`
        );
        imageIndexRef.current = (currentIndex + 1) % data.length; // Still advance index
        // Optionally, try the next image immediately or just skip this drop
        return;
      }

      const newImage: DroppedImage = {
        // Generate a more robust unique ID
        id: Date.now() + Math.random() * 1000,
        relativeX: relativeX,
        relativeY: relativeY,
        src: imageSource,
      };

      setDroppedImages((prevImages) => [...prevImages, newImage]);

      // Cycle to the next image index
      imageIndexRef.current = (currentIndex + 1) % data.length;

      // Schedule removal of the image after its lifespan
      setTimeout(() => {
        setDroppedImages((currentImages) =>
          currentImages.filter((img) => img.id !== newImage.id)
        );
      }, IMAGE_LIFESPAN_MS);
    },
    [data] // Dependency: Only re-create if `data` prop changes reference
  );

  // Effect to track mouse movement and trigger image drops
  useEffect(() => {
    const globalX = position.x;
    const globalY = position.y;
    const wrapperElement = wrapperRef.current;

    // Required conditions: valid global mouse coords and wrapper element exists
    if (globalX === null || globalY === null || !wrapperElement) {
      return;
    }

    // Get wrapper bounds (read once per effect run)
    const wrapperRect = wrapperElement.getBoundingClientRect();

    // Calculate mouse position relative to the wrapper's top-left corner
    // Note: This doesn't account for page scroll offset *if* the wrapper
    // itself isn't position:fixed. If the wrapper scrolls with the page,
    // you might need to add window.scrollX/scrollY to globalX/globalY
    // before subtracting wrapperRect.left/top.
    const relativeX = globalX - wrapperRect.left;
    const relativeY = globalY - wrapperRect.top;

    // Calculate distance moved *relative* to the wrapper since last drop
    const dropDeltaX = relativeX - lastDropRelativePositionRef.current.x;
    const dropDeltaY = relativeY - lastDropRelativePositionRef.current.y;
    const distanceSinceLastDrop = Math.sqrt(
      dropDeltaX * dropDeltaX + dropDeltaY * dropDeltaY
    );

    // Check if mouse moved significantly *within* the wrapper bounds
    // (optional: add bounds check: relativeX >= 0 && relativeX <= wrapperRect.width && ...)
    if (distanceSinceLastDrop > MIN_DISTANCE_THRESHOLD) {
      // Calculate top-left corner for the image to center it on cursor
      const imageTopLeftX = relativeX - IMAGE_WIDTH / 2;
      const imageTopLeftY = relativeY - IMAGE_HEIGHT / 2;

      // Add image using calculated top-left relative coordinates
      addImage(imageTopLeftX, imageTopLeftY);

      // Update the last drop position *relative* to the wrapper
      lastDropRelativePositionRef.current = { x: relativeX, y: relativeY };
    }

    // No need to store prevRelativePositionRef, only last drop matters for threshold
  }, [position.x, position.y, addImage]); // Dependencies: mouse coords and addImage function

  return (
    // Assign the ref to the wrapper div
    <MediaCursorWrapper ref={wrapperRef}>
      <AnimatePresence>
        {droppedImages.map((image) => (
          <AnimatedImageContainer
            key={image.id} // Key is crucial for AnimatePresence
            initial={{
              x: image.relativeX, // Position based on stored relative coords
              y: image.relativeY,
              opacity: 0, // Start fully transparent
              scale: 0.8,
            }}
            animate={{
              x: image.relativeX,
              y: image.relativeY,
              opacity: 1, // Fade in
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 20,
                mass: 0.5,
                opacity: { duration: FADE_DURATION_S, ease: "easeIn" }, // Control opacity separately
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.9, // Optional shrink on exit
              transition: {
                duration: FADE_DURATION_S,
                ease: "easeOut",
              },
            }}
          >
            <ImageWrapper>
              {/* DifferenceReveal now animates its background */}
              {/* <DifferenceReveal
                initial={{ backgroundColor: "var(--colour-white)" }} // Start black
                animate={{
                  backgroundColor: "var(--colour-black)", // Animate to white
                }}
                transition={{
                  duration: 0.5, // Duration of background transition
                  ease: "easeInOut",
                }}
              /> */}
              {/* Removed 'priority' prop for performance */}
              <Image
                src={image.src}
                alt="" // Alt text can be decorative for cursor trails
                fill
                style={{
                  objectFit: "cover",
                }}
                sizes={`${IMAGE_WIDTH}px`} // Provide specific size hint
              />
            </ImageWrapper>
          </AnimatedImageContainer>
        ))}
      </AnimatePresence>
    </MediaCursorWrapper>
  );
});

MediaCursor.displayName = "MediaCursor"; // Add display name for DevTools

export default MediaCursor;
