import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import styled from "styled-components";

type Props = {
  data: string;
  inView: boolean; // Prop indicates if the component is in the viewport
};

// Styled components remain the same
const HoverTyperWrapper = styled.div`
  position: relative;
  display: inline-block;
  display: flex;
  align-items: center;
  cursor: default;
  /* Ensure wrapper has height even when blank */
  min-height: 1.2em; /* Adjust based on line-height/font-size */
`;

const Inner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
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
    () => data.split(/(\s+)/).filter(Boolean), // Keep spaces as separate elements
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
  // Always initialize with blankWords to allow for the initial animation effect
  const [displayedWords, setDisplayedWords] = useState<string[]>(blankWords);

  // --- Refs ---
  // Refs to hold the latest state values for use in callbacks/timeouts
  const isHoveredRef = useRef(isHovered);
  isHoveredRef.current = isHovered;
  const isAnimatingRef = useRef(isAnimating);
  isAnimatingRef.current = isAnimating;
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const animationIntervalsRef = useRef<(NodeJS.Timeout | undefined)[]>([]);
  const componentJustMountedRef = useRef(true); // Ref to track initial mount

  // --- Helper to Stop Animation ---
  const stopAndClearAnimation = useCallback(() => {
    // Clear intervals used for scrambling individual words
    animationIntervalsRef.current.forEach((id) => {
      if (id) clearInterval(id);
    });
    animationIntervalsRef.current = [];
    // Clear timeouts used for revealing final words
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    // Only update state if necessary
    if (isAnimatingRef.current) {
      setIsAnimating(false);
    }
  }, []); // No dependencies, uses refs

  // --- Effect for InView Changes & Initial Animation ---
  useEffect(() => {
    // Check if the component is currently displaying the blank state
    const isCurrentlyBlank =
      JSON.stringify(displayedWords) === JSON.stringify(blankWords);
    const justMounted = componentJustMountedRef.current;

    if (inView) {
      // Trigger animation if:
      // 1. It's the initial mount and should be visible OR
      // 2. It scrolled into view and is currently blank
      // Ensure it's not already animating.
      if ((justMounted || isCurrentlyBlank) && !isAnimatingRef.current) {
        console.log(
          "HoverTyper: In View & should animate (Initial or Scrolled In)"
        );
        setIsAnimating(true); // Start the animation
      } else if (!isCurrentlyBlank && !isAnimatingRef.current) {
        // If it comes into view and is *already* showing the text (e.g., scrolled out/in quickly)
        // Ensure it displays the correct original words without animating again.
        // This might happen if the cleanup/reset didn't fully complete before scrolling back in.
        setDisplayedWords(originalWords);
      }
    } else {
      // --- Scrolling OUT of view ---
      // Avoid resetting on the very first render if initialized as out of view
      if (!justMounted) {
        console.log("HoverTyper: Out of View");
        stopAndClearAnimation(); // Stop any ongoing animation
        // Only reset to blank if not already blank to avoid unnecessary renders
        if (!isCurrentlyBlank) {
          setDisplayedWords(blankWords); // Reset to blank state
        }
        setIsHovered(false); // Ensure hover state is off
      }
    }

    // After the first run, mark component as mounted
    if (justMounted) {
      componentJustMountedRef.current = false;
    }
  }, [
    inView,
    blankWords,
    originalWords, // Add originalWords dependency
    displayedWords, // Add displayedWords dependency
    stopAndClearAnimation,
  ]);

  // --- Event Handlers ---
  const handleMouseEnter = () => {
    // Allow hover effect only if in view and not currently animating
    if (inView && !isAnimatingRef.current) {
      setIsHovered(true);
      setIsAnimating(true); // Trigger hover animation
    } else if (inView) {
      // If already animating (e.g., initial reveal), just track hover state
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset logic is handled by animation completion or scrolling out of view
  };

  // --- Main Animation Effect ---
  useEffect(() => {
    // Only run if isAnimating flag is set true and we have words
    if (!isAnimating || !originalWords.length) {
      return;
    }
    console.log("HoverTyper: Animation START");

    // --- Animation Setup ---
    // 1. Immediately set to a fully scrambled state based on ORIGINAL words
    //    This ensures the animation starts from a random visual state.
    setDisplayedWords(
      originalWords.map((wordOrSpace) =>
        wordOrSpace.trim() === ""
          ? wordOrSpace // Keep spaces
          : wordOrSpace
              .split("")
              .map(() => getRandomChar())
              .join("")
      )
    );

    // Use a microtask to defer the interval/timeout setup slightly.
    // This allows React to process the state update above first, ensuring
    // the scrambling intervals work on the newly set scrambled state.
    queueMicrotask(() => {
      // Double-check if still animating after microtask, as stopAndClearAnimation might have been called.
      if (!isAnimatingRef.current) {
        console.log("HoverTyper: Animation stopped before intervals set up.");
        return;
      }

      let charIndexOffset = 0;
      let maxResolveTime = 0;
      let lastWordIndex = -1; // Index of the last non-space word

      // Clear any stray timers/intervals from potential race conditions
      stopAndClearAnimation();
      // Re-assert animating state as stopAndClearAnimation sets it to false
      setIsAnimating(true);

      // 2. Set up intervals and timeouts for each word reveal
      originalWords.forEach((wordOrSpace, wordIndex) => {
        if (wordOrSpace.trim() === "") {
          // Account for space length if needed for timing, but don't animate spaces
          charIndexOffset += wordOrSpace.length;
          return; // Skip spaces
        }

        const word = wordOrSpace;
        const wordLength = word.length;
        // Calculate when this word should finish revealing
        // Formula: (start_index + length - 1) * char_delay + base_delay
        const resolveTime = (charIndexOffset + wordLength - 1) * 15 + 150; // Adjust timing (15ms/char, 150ms base)

        if (resolveTime > maxResolveTime) {
          maxResolveTime = resolveTime;
          lastWordIndex = wordIndex;
        }

        // Interval to keep scrambling *this specific word* until its reveal time
        const intervalId = setInterval(() => {
          setDisplayedWords((prev) => {
            // Check if the word exists, hasn't resolved yet, and animation is still active
            if (
              !prev ||
              !prev[wordIndex] ||
              prev[wordIndex] === originalWords[wordIndex] ||
              !isAnimatingRef.current
            ) {
              clearInterval(intervalId); // Stop scrambling this word
              // Clean up ref array
              const refIndex =
                animationIntervalsRef.current.indexOf(intervalId);
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
        }, 50); // Scramble update frequency (50ms)
        animationIntervalsRef.current[wordIndex] = intervalId; // Store for cleanup

        // Timeout to stop the interval and reveal the final word
        const timeoutId = setTimeout(() => {
          clearInterval(intervalId); // Stop scrambling this word
          const refIndex = animationIntervalsRef.current.indexOf(intervalId);
          if (refIndex > -1)
            animationIntervalsRef.current[refIndex] = undefined; // Clean up ref array

          setDisplayedWords((prev) => {
            if (!prev) return prev; // Should not happen, but safety check
            const newWords = [...prev];
            // Ensure setting the correct original word
            newWords[wordIndex] = originalWords[wordIndex];
            return newWords;
          });

          // --- Last Word Finished Check ---
          if (wordIndex === lastWordIndex) {
            console.log("HoverTyper: Animation END");
            // Use another microtask to ensure the final word state update is processed
            // before setting isAnimating to false.
            queueMicrotask(() => {
              // Check if animation wasn't stopped externally (e.g., scrolled out)
              if (isAnimatingRef.current) {
                setIsAnimating(false); // Mark animation as naturally finished
                // No need to check hover state here, the animation's purpose is completed.
                // If the mouse is still hovering, a new animation might start on mouseEnter again.
              }
            });
          }
        }, resolveTime);

        timeoutsRef.current[wordIndex] = timeoutId; // Store timeout for potential cleanup
        charIndexOffset += wordLength; // Move offset for the next word
      });
    });

    // --- Effect Cleanup ---
    // This runs when the component unmounts OR when dependencies change BEFORE the effect runs again
    return () => {
      console.log("HoverTyper: Animation effect cleanup");
      stopAndClearAnimation();
    };
    // Rerun effect *only* when isAnimating becomes true, or originalWords/data changes
  }, [isAnimating, originalWords, data, stopAndClearAnimation]);

  // --- Render Logic ---
  // Always render based on displayedWords. Use visibility for blank state.
  return (
    <HoverTyperWrapper
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={data} // Good for accessibility
      className="hover-typer"
    >
      <Inner>
        {/* Render based on displayedWords, comparing with blankWords for visibility */}
        {displayedWords.map((wordOrSpace, index) => {
          const isCurrentlyBlankWord = wordOrSpace === blankWords[index];
          const isSpace = originalWords[index]?.trim() === ""; // Check original data for spaces

          if (isSpace) {
            // Render spaces directly
            return <span key={index}>{wordOrSpace}</span>;
          } else {
            // Render words/scrambled words
            return (
              <WordWrapper
                key={index}
                // Hide with visibility: hidden if it matches the blank word representation
                // This preserves layout space.
                style={{
                  visibility: isCurrentlyBlankWord ? "hidden" : "visible",
                }}
              >
                {wordOrSpace.split("").map((char, charIndex) => (
                  <CharSpan key={charIndex} className="color-switch">
                    {/* Render non-breaking space if char is blank, otherwise char */}
                    {char === BLANK_CHAR ? "\u00A0" : char}
                  </CharSpan>
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
