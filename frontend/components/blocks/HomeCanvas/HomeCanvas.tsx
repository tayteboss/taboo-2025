import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import CanvasCard from "../../elements/CanvasCard";

// --- TYPE IMPORTS ---
// Make sure this path is correct for your project setup
// Example: import { HomePageType } from "../../shared/types/types";
// Using a placeholder type if the actual one isn't critical for the component logic itself
type HomePageItem = { id: string | number; [key: string]: any }; // Basic placeholder
type HomePageType = { items: HomePageItem[] };

// --- HOOK IMPORT ---
// Make sure this path is correct for your project setup
// Example: import { useMousePosition } from "../../hooks/useMousePosition";

// --- Placeholder Hook Implementation (if needed for testing - REPLACE with your actual hook) ---
type ReturnMousePosition = {
  x: number | null;
  y: number | null;
};
const useMousePosition = (): ReturnMousePosition => {
  const [position, setPosition] = useState<ReturnMousePosition>({
    x: null,
    y: null,
  });
  useEffect(() => {
    const setFromEvent = (e: MouseEvent) =>
      setPosition({ x: e.clientX, y: e.clientY });
    // Basic throttle
    let timeoutId: NodeJS.Timeout | null = null;
    const throttledSetFromEvent = (e: MouseEvent) => {
      if (timeoutId === null) {
        setFromEvent(e);
        timeoutId = setTimeout(() => {
          timeoutId = null;
        }, 50); // ~20fps throttle
      }
    };
    window.addEventListener("mousemove", throttledSetFromEvent);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("mousemove", throttledSetFromEvent);
    };
  }, []);
  return position;
};
// --- End Placeholder Hook ---

// --- Styled Components ---

const HomeCanvasWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh; /* Or 100svh/lvh if needed */
  overflow: hidden;
  backface-visibility: hidden; /* Improve rendering performance */
  contain: layout paint; /* Limit layout and paint work */
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  transform: translate3d(0, 0, 0);
  transform: translateZ(0);
  /* Optional: Add a subtle background if desired */
  /* background-color: #f0f0f0;  */
`;

const ItemWrapper = styled(motion.div)`
  position: absolute; /* Needed for top/left positioning by Framer Motion */
  border-radius: 10px;
  will-change: transform; /* Performance hint */
  display: flex;
  justify-content: center;
  overflow: hidden;
  align-items: center;
  cursor: pointer; /* Indicate items might be interactive */
  transform-origin: center center; /* Important for rotation */
  background: red;
`;

// --- Configuration Variables ---

// Max items to render from data
const MAX_ITEMS_TO_DISPLAY = 20;
// Strength of parallax effect (higher = more movement)
const BASE_PARALLAX_STRENGTH = 600;
// Base Spring animation config (No delay here!)
const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 30,
  mass: 1,
};

/// --- Manual Layout Configuration ---

// Define the position (top, left as percentages) and depth factor for each item.

// This determines the STATIC layout when the mouse is centered (zero parallax offset).

// Adjust these values if the initial visual arrangement needs changing.

const manualLayoutConfig = [
  // Item 0 (Original DF: 0.8) - Top Edge Bleed (Leftish)
  { top: "-40%", left: "30%", depthFactor: 0.8 }, // Stays same
  // Item 1 (Original DF: 0.9) - Bottom Edge Bleed (Rightish)
  { top: "105%", left: "70%", depthFactor: 0.9 }, // Stays same
  // Item 2 (Original DF: 0.7) - Left Edge Bleed (Bottom) - Pushed further
  { top: "80%", left: "-22%", depthFactor: 0.7 },
  // Item 3 (Original DF: 1.0) - Bottom Right Visible Area
  { top: "65%", left: "90%", depthFactor: 1.0 }, // Stays same
  // Item 4 (Original DF: 0.85) - Top Right Corner Bleed - Pushed further
  { top: "-20%", left: "115%", depthFactor: 0.85 },
  // Item 5 (Original DF: 0.75) - Top Left Corner Bleed - Pushed further
  { top: "-15%", left: "-20%", depthFactor: 0.75 },
  // Item 6 (Original DF: 0.95) - Right Edge Bleed (Middle) - Pushed further
  { top: "65%", left: "118%", depthFactor: 0.95 },
  // Item 7 (Original DF: 0.9) - MOVED Left Visible Area (Top)
  { top: "2%", left: "8%", depthFactor: 0.9 },
  // Item 8 (Original DF: 0.8) - Bottom Edge Bleed (Leftish)
  { top: "115%", left: "40%", depthFactor: 0.8 }, // Stays same
  // Item 9 (Original DF: 0.7) - Left Edge Bleed (Top)
  { top: "25%", left: "-10%", depthFactor: 0.7 }, // Stays same
  // Item 10 (Original DF: 0.85) - Center Area (Left)
  { top: "40%", left: "60%", depthFactor: 0.85 }, // Stays same
  // Item 11 (Original DF: 0.95) - Right Edge Bleed (Top) - Pushed further
  { top: "20%", left: "110%", depthFactor: 0.95 },
  // Item 12 (Original DF: 0.8) - Center Area (Bottom Mid)
  { top: "70%", left: "55%", depthFactor: 0.8 }, // Stays same
  // Item 13 (Original DF: 0.9) - Bottom Right Corner Bleed - Pushed further
  { top: "115%", left: "110%", depthFactor: 0.9 },
  // Item 14 (Original DF: 0.7) - MOVED Center Area (Top Mid-Left)
  { top: "-10%", left: "40%", depthFactor: 0.7 },
  // Item 15 (Original DF: 0.75) - Left Edge Visible Area (Bottom)
  { top: "65%", left: "8%", depthFactor: 0.75 }, // Stays same
  // Item 16 (Original DF: 0.95) - Center Area (Top Mid)
  { top: "20%", left: "45%", depthFactor: 0.95 }, // Stays same
  // Item 17 (Original DF: 0.8) - Bottom Left Corner Bleed - Pushed further
  { top: "110%", left: "-15%", depthFactor: 0.8 },
  // Item 18 (Original DF: 0.85) - MOVED Left Visible Area (Mid)
  { top: "50%", left: "25%", depthFactor: 0.85 },
  // Item 19 (Original DF: 0.9) - Top Edge Bleed (Rightish)
  { top: "-5%", left: "80%", depthFactor: 0.9 }, // Stays same (provides some right balance)
];

// --- Helper Function for seeded random values ---
// Used for the initial "deck" state randomness
const seededRandomRange = (seed: number, min: number, max: number): number => {
  const random = Math.sin(seed) * 10000;
  const normalized = random - Math.floor(random); // Value 0 <= x < 1
  return min + normalized * (max - min);
};

// --- Component Props ---
type Props = {
  data: HomePageType["items"]; // Pass in the array of items
};

// --- The Component ---
const HomeCanvas = (props: Props) => {
  // Slice data based on limits and available layout configs
  const itemsToRender = props.data
    ? props.data.slice(
        0,
        Math.min(MAX_ITEMS_TO_DISPLAY, manualLayoutConfig.length)
      )
    : [];
  const hasData = itemsToRender.length > 0;

  // Get mouse position (starts {x: null, y: null})
  const position = useMousePosition();
  // State for window dimensions
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Effect to track window size
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize(); // Initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate normalized mouse position (-0.5 to 0.5), defaults to 0 (center) initially
  const liveNormalizedX =
    position.x !== null && windowSize.width > 0
      ? position.x / windowSize.width - 0.5
      : 0;
  const liveNormalizedY =
    position.y !== null && windowSize.height > 0
      ? position.y / windowSize.height - 0.5
      : 0;

  return (
    <HomeCanvasWrapper>
      {
        hasData &&
          // Map over the data and render an animated item for each
          itemsToRender.map((item, index) => {
            // Get the final layout config for this item
            const layout = manualLayoutConfig[index];
            const { top: finalTop, left: finalLeft, depthFactor } = layout;

            // Calculate the current parallax offset based on mouse position
            const liveTargetTranslateX =
              -liveNormalizedX * BASE_PARALLAX_STRENGTH * depthFactor;
            const liveTargetTranslateY =
              -liveNormalizedY * BASE_PARALLAX_STRENGTH * depthFactor;

            // Determine the unique key for React
            const itemKey =
              item && typeof item === "object" && "id" in item && item.id
                ? item.id
                : `item-${index}`;

            // --- Define Initial "Deck" State ---
            const initialSeed = index + 1;
            const initialRotation = seededRandomRange(
              initialSeed * 1.1,
              -15,
              15
            );
            const initialOffsetX = seededRandomRange(
              initialSeed * 1.2,
              -20,
              20
            );
            const initialOffsetY = seededRandomRange(
              initialSeed * 1.3,
              -20,
              20
            );

            const initialState = {
              top: "50%",
              left: "50%", // Start centered
              x: "-50%",
              y: "-50%", // Center element using transform
              translateX: `${initialOffsetX}px`, // Apply random pixel offset
              translateY: `${initialOffsetY}px`,
              rotate: initialRotation, // Apply random rotation
              opacity: 1, // Start invisible
            };

            // --- Define Final "Animated" State ---
            const animateState = {
              top: finalTop,
              left: finalLeft, // Target final layout position
              x: `${liveTargetTranslateX}px`, // Target current parallax offset
              y: `${liveTargetTranslateY}px`,
              translateX: "0px", // Reset random offset
              translateY: "0px",
              rotate: 0, // Reset rotation
              opacity: 1, // Fade in
            };

            // --- Define Transition Logic ---
            // Base delay + stagger for the initial fan-out animation
            const staggerDelay = 1.5 + index * 0.05; // Adjust base delay & stagger factor as needed

            const transitionConfig = {
              // --- Define the ONGOING transition for parallax (x, y) ---
              // Use the base spring WITHOUT delay for responsiveness.
              x: { ...springTransition },
              y: { ...springTransition },

              // --- Define transitions ONLY for the initial fan-out ---
              // These properties animate once with a delay.
              opacity: { duration: 0.4, delay: staggerDelay },
              rotate: { duration: 0.6, ease: "easeOut", delay: staggerDelay },
              translateX: {
                duration: 0.6,
                ease: "easeOut",
                delay: staggerDelay,
              }, // Animate offset back to 0
              translateY: {
                duration: 0.6,
                ease: "easeOut",
                delay: staggerDelay,
              },
              // Delay the initial positional animation (top, left) as well
              top: { ...springTransition, delay: staggerDelay },
              left: { ...springTransition, delay: staggerDelay },
            };

            console.log("item", item);

            // Render the animated item
            return (
              <ItemWrapper
                key={itemKey}
                initial={initialState} // State before animation starts
                animate={animateState} // Target state (includes live parallax)
                transition={transitionConfig} // How to animate between states
              >
                <CanvasCard
                  id={item.id}
                  media={item.media}
                  project={item.project}
                  title={item.title}
                  year={item.year}
                  description={item.description}
                  link={item.link}
                  useProjectReference={item?.useProjectReference}
                />
                {/* Content of the item - display index/depth for layout help */}
                {/* {`Index: ${index} D:${depthFactor.toFixed(2)}`} */}
              </ItemWrapper>
            );
          }) // End map
      }
    </HomeCanvasWrapper>
  );
};

// Export the component
export default HomeCanvas;
