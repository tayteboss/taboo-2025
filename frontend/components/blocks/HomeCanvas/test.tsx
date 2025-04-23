import React, { useState, useEffect } from "react";

import styled from "styled-components";

import { motion } from "framer-motion";

// --- TYPE IMPORTS ---

// Ensure this path is correct for your project structure

import { HomePageType } from "../../../shared/types/types";

// --- HOOK IMPORT ---

// Ensure this path is correct for your project structure

import { useMousePosition } from "../../../hooks/useMousePosition";

// --- Styled Components ---

const HomeCanvasWrapper = styled(motion.div)`
  /* Ensure fixed positioning and full viewport coverage */

  position: fixed;

  top: 0;

  left: 0;

  width: 100%;

  height: 100vh; /* Consider 100svh or 100lvh for mobile if needed */

  overflow: hidden;

  /* Added distinct background for debugging - REMOVE LATER if desired */

  background-color: rgba(0, 255, 0, 0.1); /* Light GREEN, semi-transparent */
`;

const ItemWrapper = styled(motion.div)`
  position: absolute;

  width: 150px; // Item size

  height: 150px; // Item size

  background-color: red; // Placeholder color

  border-radius: 8px;

  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  will-change: transform; // Performance hint

  display: flex;

  justify-content: center;

  align-items: center;

  color: white;

  font-size: 10px;

  font-family: sans-serif;

  /* Uncomment if items interfere with clicking underlying content */

  /* pointer-events: none; */
`;

// --- Configuration Variables ---

// Maximum number of items to display

const MAX_ITEMS_TO_DISPLAY = 20;

// Base strength of the parallax effect. Higher value = more movement overall.

const BASE_PARALLAX_STRENGTH = 1000;

// Spring animation configuration for smoothness

const springTransition = {
  type: "spring",

  stiffness: 100,

  damping: 30,

  mass: 1,
};

// --- Manual Layout Configuration ---

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

  // Item 20 (Original DF: 0.7) - Center Area (Bottom Left)

  { top: "80%", left: "30%", depthFactor: 0.7 }, // Stays same
];

// --- Component Props ---

type Props = {
  // Assuming 'items' is an array of objects, potentially with unique IDs

  data: HomePageType["items"];
};

// --- The Component ---

const HomeCanvas = (props: Props) => {
  // Limit data based on MAX_ITEMS *and* available manual layout configs

  const itemsToRender = props.data
    ? props.data.slice(
        0,

        Math.min(MAX_ITEMS_TO_DISPLAY, manualLayoutConfig.length)
      )
    : [];

  const hasData = itemsToRender.length > 0;

  // Raw position from hook (likely starts {x: null, y: null})

  const position = useMousePosition();

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Effect to track window size

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize(); // Get initial size on mount

    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount

    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array means this runs only on mount and unmount

  // Calculate normalized mouse position (-0.5 to 0.5) based on LIVE position.

  // Defaults to 0 if position from hook is null initially (represents centered mouse).

  const liveNormalizedX =
    position.x !== null && windowSize.width > 0
      ? position.x / windowSize.width - 0.5
      : 0;

  const liveNormalizedY =
    position.y !== null && windowSize.height > 0
      ? position.y / windowSize.height - 0.5
      : 0;

  // Map data items to configuration objects needed for rendering

  const itemConfigs = itemsToRender.map((item, index) => {
    // Get the predefined layout for this item index.

    const layout = manualLayoutConfig[index];

    const { top, left, depthFactor } = layout;

    // Calculate the LIVE translation offset based on the current mouse position.

    // This will be used for the 'animate' prop target.

    const liveTargetTranslateX =
      -liveNormalizedX * BASE_PARALLAX_STRENGTH * depthFactor;

    const liveTargetTranslateY =
      -liveNormalizedY * BASE_PARALLAX_STRENGTH * depthFactor;

    // Define the INITIAL translation offset explicitly as 0 (matches centered mouse).

    // This will be used for the 'initial' prop target.

    const initialTranslateX = 0;

    const initialTranslateY = 0;

    // Determine the unique key for React rendering. Use item.id if available.

    const itemKey =
      item && typeof item === "object" && "id" in item && item.id
        ? item.id
        : `item-${index}`; // Fallback to index-based key

    // Return the configuration object for this item

    return {
      key: itemKey,

      initialTop: top,

      initialLeft: left,

      initialX: initialTranslateX, // Initial offset (should be 0)

      initialY: initialTranslateY, // Initial offset (should be 0)

      liveX: liveTargetTranslateX, // Live offset based on mouse

      liveY: liveTargetTranslateY, // Live offset based on mouse

      depthFactor,
    };
  });

  return (
    <HomeCanvasWrapper>
      {hasData ? (
        // Map over the calculated configurations and render each item

        itemConfigs.map((config) => (
          <ItemWrapper
            key={config.key}
            // Apply the base position from the manual layout

            style={{
              top: config.initialTop,

              left: config.initialLeft,
            }}
            // Set the initial animation state (should be x: 0, y: 0)

            initial={{ x: config.initialX, y: config.initialY }}
            // Animate towards the live state calculated from current mouse pos

            animate={{
              x: config.liveX,

              y: config.liveY,
            }}
            // Apply the smooth spring transition

            transition={springTransition}
          >
            {/* Display index and depth for easier layout adjustment */}

            {`Index: ${config.key.toString().startsWith("item-") ? config.key.toString().split("-").pop() : config.key} D:${config.depthFactor.toFixed(2)}`}
          </ItemWrapper>
        ))
      ) : (
        // Display a message if there's no data

        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
          Loading items or no data provided...
        </div>
      )}
    </HomeCanvasWrapper>
  );
};

export default HomeCanvas;
