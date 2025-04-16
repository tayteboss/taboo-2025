import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

// Define the Props including the new inView prop
type Props = {
  data: string;
  inView: boolean; // Prop to control animation trigger
};

// Main wrapper, display: inline-block allows it to size based on content
const InViewTyperWrapper = styled(motion.div)`
  position: relative;
  display: inline-block;
  overflow: hidden; // Hide characters before they animate in
`;

// Flex container for the letters
const Inner = styled(motion.div)`
  display: flex;
`;

// Individual character span
const Span = styled(motion.span)`
  white-space: pre; // Preserve spaces
  display: inline-block; // Needed for transform animations like y
`;

// --- Animation Variants ---

// Variants for the container to orchestrate staggering
const containerVariants = {
  hidden: { opacity: 0 },
  visible: (delayMultiplier = 0.05) => ({
    // Accept a delay multiplier argument if needed
    opacity: 1,
    transition: {
      staggerChildren: delayMultiplier, // Stagger delay between each letter
    },
  }),
};

// Variants for each individual letter
const letterVariants = {
  hidden: {
    opacity: 0,
    y: 20, // Start slightly below final position
    transition: {
      type: "spring", // Optional: use spring physics
      damping: 12,
      stiffness: 200,
    },
  },
  visible: {
    opacity: 1,
    y: 0, // Animate to final position
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200,
    },
  },
};

// Helper function to get a random character
const getRandomChar = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=[]{};:,.<>?"; // Expanded character set for more glitch variety
  const randomIndex = Math.floor(Math.random() * chars.length);
  return chars[randomIndex];
};

// Renamed component: InViewTyper
const InViewTyper = ({ data, inView }: Props) => {
  // State to hold the currently displayed characters (for the glitch effect)
  // Initialize with the final string to avoid layout shifts before animation
  const [displayedChars, setDisplayedChars] = useState<string[]>(
    data.split("")
  );

  // Store the original characters split into an array
  const originalChars = React.useMemo(() => data.split(""), [data]);

  // useEffect to handle the glitch animation when inView becomes true
  useEffect(() => {
    let intervals: NodeJS.Timeout[] = [];
    let timeouts: NodeJS.Timeout[] = [];

    // Only run the glitch effect if the component is in view
    if (inView) {
      // Set initial state for animation (can be empty or spaces if preferred)
      // For this setup, we rely on variants to hide initially, so we start glitching immediately
      // setDisplayedChars(Array(originalChars.length).fill(' ')); // Alternative: start with spaces

      originalChars.forEach((_, i) => {
        // Interval to rapidly change the character (the glitch)
        intervals[i] = setInterval(() => {
          setDisplayedChars((prevChars) => {
            const newChars = [...prevChars];
            // Ensure we don't glitch already finalized characters if effect reruns
            if (newChars[i] !== originalChars[i]) {
              newChars[i] = getRandomChar();
            }
            return newChars;
          });
        }, 60); // Glitch speed (milliseconds)

        // Timeout to stop the glitch and set the final correct character
        // The delay is staggered based on the character index (i)
        // Match the stagger delay roughly with containerVariants.staggerChildren
        const staggerDelay = 0.05; // seconds
        const glitchDurationPerLetter = 150; // ms - how long each letter glitches before settling
        timeouts[i] = setTimeout(
          () => {
            clearInterval(intervals[i]); // Stop the glitching interval for this character
            setDisplayedChars((prevChars) => {
              const newChars = [...prevChars];
              newChars[i] = originalChars[i]; // Set the correct character
              return newChars;
            });
          },
          i * (staggerDelay * 1000) + glitchDurationPerLetter
        ); // Staggered timeout
      });
    }

    // Cleanup function: clear all intervals and timeouts when
    // the component unmounts or the `inView` prop becomes false.
    return () => {
      intervals.forEach((interval) => clearInterval(interval));
      timeouts.forEach((timeout) => clearTimeout(timeout));
      // Optional: Reset displayedChars if you want it to clear when out of view
      // if (!inView) {
      //   setDisplayedChars(originalChars); // Or Array(originalChars.length).fill(' ')
      // }
    };
    // Dependencies: Run effect when `data` changes or `inView` status changes
  }, [data, inView, originalChars]);

  return (
    // Use the wrapper for the main container animation control
    <InViewTyperWrapper
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={0.05} // Pass stagger delay if needed as custom prop
    >
      <Inner>
        {/* Map over the *original* characters for stable keys & structure */}
        {/* Display characters from the `displayedChars` state */}
        {originalChars.map((_, i) => (
          <Span
            key={`${data}-${i}`} // Use a key that includes data in case it changes
            variants={letterVariants}
            // No need for initial/animate here, they are inherited from the parent (Inner)
          >
            {/* Display the character from state, which glitches and then settles */}
            {displayedChars[i]}
          </Span>
        ))}
      </Inner>
    </InViewTyperWrapper>
  );
};

export default InViewTyper;
