import React, { useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";

type Props = {
  data: string;
  inView: boolean; // New prop
};

// Styled components remain the same
const HoverTyperWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: default;
  /* Ensure wrapper has height even when blank */
  min-height: 1.4em; /* Adjust based on line-height/font-size */
`;

const Inner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  line-height: 1.4;
`;

const WordWrapper = styled.span`
  display: inline-block;
  white-space: nowrap;
  margin-right: 0.4em;
  &:last-child {
    margin-right: 0;
  }
`;

const CharSpan = styled.span`
  display: inline-block;
  white-space: pre;
`;

const getRandomChar = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomIndex = Math.floor(Math.random() * chars.length);
  return chars[randomIndex];
};

// Non-breaking space character
const BLANK_CHAR = "\u00A0";

const HoverTyper = ({ data, inView }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // --- Derived Data ---
  const originalWords = useMemo(
    () => data.split(/(\s+)/).filter(Boolean),
    [data]
  );

  // Calculate blank state based on original words
  const blankWords = useMemo(() => {
    return originalWords.map(
      (wordOrSpace) =>
        wordOrSpace.trim() === ""
          ? wordOrSpace // Keep spaces
          : BLANK_CHAR.repeat(wordOrSpace.length) // Replace chars with non-breaking spaces
    );
  }, [originalWords]);

  // --- State ---
  // Initial state depends on whether it's in view from the start
  const [displayedWords, setDisplayedWords] = useState<string[]>(() =>
    inView ? originalWords : blankWords
  );

  // --- Refs ---
  const isHoveredRef = useRef(isHovered);
  isHoveredRef.current = isHovered;
  const isAnimatingRef = useRef(isAnimating); // Ref to track animation state in callbacks
  isAnimatingRef.current = isAnimating;
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  // Ref for interval IDs created by the main animation effect run
  const animationIntervalsRef = useRef<(NodeJS.Timeout | undefined)[]>([]);

  // --- Helper to Stop Animation ---
  // Use useCallback to ensure stable reference if passed as dependency
  const stopAndClearAnimation = React.useCallback(() => {
    animationIntervalsRef.current.forEach((id) => {
      if (id) clearInterval(id);
    });
    animationIntervalsRef.current = [];
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    // Only set isAnimating to false if it's currently true
    if (isAnimatingRef.current) {
      setIsAnimating(false);
    }
  }, []); // No dependencies needed as it uses refs

  // --- Effect for InView Changes ---
  useEffect(() => {
    // Check if the component is currently displaying the blank state
    // Compare stringified versions for reliable comparison of arrays/content
    const isCurrentlyBlank =
      JSON.stringify(displayedWords) === JSON.stringify(blankWords);

    if (inView) {
      // If scrolling INTO view AND it's currently blank AND not already animating
      if (isCurrentlyBlank && !isAnimatingRef.current) {
        setIsAnimating(true); // Trigger the animation
      } else if (!isCurrentlyBlank && !isAnimatingRef.current) {
        // If it comes into view and is already showing the text (e.g. initial prop)
        // Ensure it displays the correct original words
        setDisplayedWords(originalWords);
      }
    } else {
      // If scrolling OUT of view
      stopAndClearAnimation(); // Stop any current animation
      setDisplayedWords(blankWords); // Reset to blank state
    }
  }, [
    inView,
    blankWords,
    displayedWords,
    originalWords,
    stopAndClearAnimation,
  ]);

  // --- Event Handlers ---
  const handleMouseEnter = () => {
    // Allow hover effect only if in view and not already animating
    if (inView && !isAnimatingRef.current) {
      setIsHovered(true);
      setIsAnimating(true); // Trigger hover animation
    } else if (inView) {
      // If already animating, just track hover state
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset logic handled by animation completion or scrolling out of view
  };

  // --- Main Animation Effect ---
  useEffect(() => {
    // Only run if isAnimating flag is set true
    if (!isAnimating || !originalWords.length) {
      return;
    }

    // --- Animation Setup ---
    let charIndexOffset = 0;
    let maxResolveTime = 0;
    let lastWordIndex = -1;

    // Clear previous refs before starting new animation cycle
    animationIntervalsRef.current.forEach((id) => {
      if (id) clearInterval(id);
    });
    animationIntervalsRef.current = [];
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // 1. Initial Scramble State (based on current displayed words)
    //    This ensures hover effect scrambles current text, not just from blank
    const wordsToScramble =
      displayedWords.length === originalWords.length
        ? displayedWords
        : originalWords;
    setDisplayedWords(
      wordsToScramble.map((wordOrSpace) =>
        wordOrSpace.trim() === ""
          ? wordOrSpace
          : wordOrSpace
              .split("")
              .map(() => getRandomChar())
              .join("")
      )
    );

    // 2. Set up intervals and timeouts for each word reveal
    originalWords.forEach((wordOrSpace, wordIndex) => {
      if (wordOrSpace.trim() === "") {
        charIndexOffset += wordOrSpace.length;
        return; // Skip spaces
      }

      const word = wordOrSpace;
      const wordLength = word.length;
      const resolveTime = (charIndexOffset + wordLength - 1) * 15 + 100;

      if (resolveTime > maxResolveTime) {
        maxResolveTime = resolveTime;
        lastWordIndex = wordIndex;
      }

      // Interval to keep scrambling *this word*
      const intervalId = setInterval(() => {
        setDisplayedWords((prev) => {
          // Check if the word exists and hasn't resolved yet
          if (
            !prev[wordIndex] ||
            prev[wordIndex] === originalWords[wordIndex]
          ) {
            // defensive clear if already resolved
            clearInterval(intervalId);
            // Ensure the interval ref is cleaned up if cleared early
            const refIndex = animationIntervalsRef.current.indexOf(intervalId);
            if (refIndex > -1)
              animationIntervalsRef.current[refIndex] = undefined;
            return prev;
          }
          const newWords = [...prev];
          newWords[wordIndex] = word
            .split("")
            .map(() => getRandomChar())
            .join("");
          return newWords;
        });
      }, 50);
      // Store interval ID in the ref for potential cleanup by stopAndClearAnimation
      animationIntervalsRef.current[wordIndex] = intervalId;

      // Timeout to stop the interval and reveal the final word
      const timeoutId = setTimeout(() => {
        // Clear interval using the ID captured in this scope
        clearInterval(intervalId);
        const refIndex = animationIntervalsRef.current.indexOf(intervalId);
        if (refIndex > -1) animationIntervalsRef.current[refIndex] = undefined;

        setDisplayedWords((prev) => {
          const newWords = [...prev];
          // Ensure setting correct word even if state updates were batched weirdly
          newWords[wordIndex] = originalWords[wordIndex];
          return newWords;
        });

        // --- Last Word Check ---
        if (wordIndex === lastWordIndex) {
          queueMicrotask(() => {
            // Check if animation wasn't stopped externally (e.g., scrolled out)
            if (isAnimatingRef.current) {
              setIsAnimating(false); // Animation sequence finished naturally
              // Reset only if hover animation finished and mouse is outside
              if (!isHoveredRef.current) {
                // Check if it wasn't an inView animation that just finished
                // We can infer this: if hover isn't true, it must have been inView OR a hover that ended.
                // Reset to original words in both cases where hover isn't active post-animation.
                setDisplayedWords(originalWords);
              }
              // If isHoveredRef.current is true, leave the text revealed.
            }
          });
        }
      }, resolveTime);

      timeoutsRef.current[wordIndex] = timeoutId; // Store for cleanup
      charIndexOffset += wordLength;
    });

    // --- Effect Cleanup ---
    // This runs when the component unmounts OR when isAnimating/originalWords/data changes
    return () => {
      // Use the cleanup helper function
      stopAndClearAnimation();
    };
    // Rerun effect *only* when animation is triggered, or data changes
  }, [isAnimating, originalWords, data, stopAndClearAnimation]); // Add stopAndClearAnimation dependency

  return (
    <HoverTyperWrapper
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // Add aria-label for accessibility if needed, or aria-live for screen readers
      aria-label={data}
    >
      <Inner>
        {/* Render blank state with visibility hidden to preserve space */}
        {displayedWords.map((wordOrSpace, index) => {
          const isBlank = wordOrSpace === blankWords[index];
          if (wordOrSpace.trim() === "" && !isBlank) {
            // Render spaces normally if not blank
            return <span key={index}> </span>;
          } else if (wordOrSpace.trim() === "" && isBlank) {
            // Render blank spaces
            return <span key={index}>{wordOrSpace}</span>;
          } else {
            // Render words/blank words
            return (
              <WordWrapper
                key={index}
                style={{ visibility: isBlank ? "hidden" : "visible" }}
              >
                {wordOrSpace.split("").map((char, charIndex) => (
                  <CharSpan key={charIndex}>{char}</CharSpan>
                ))}
              </WordWrapper>
            );
          }
        })}
      </Inner>
    </HoverTyperWrapper>
  );
};

export default HoverTyper;
