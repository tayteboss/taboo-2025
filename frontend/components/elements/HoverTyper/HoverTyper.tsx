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
  inView: boolean;
};

// Styled components remain the same
const HoverTyperWrapper = styled.div`
  position: relative;
  display: inline-block;
  display: flex;
  align-items: center;
  cursor: default;
  min-height: 1.2em;
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
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"; // Added more chars
  const randomIndex = Math.floor(Math.random() * chars.length);
  return chars[randomIndex];
};

const BLANK_CHAR = "\u00A0"; // Non-breaking space

const HoverTyper = ({ data, inView }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // --- Derived Data ---
  const originalWords = useMemo(
    () => data.split(/(\s+)/).filter(Boolean),
    [data]
  );

  const blankWords = useMemo(() => {
    return originalWords.map((wordOrSpace) =>
      wordOrSpace.trim() === ""
        ? wordOrSpace
        : BLANK_CHAR.repeat(wordOrSpace.length)
    );
  }, [originalWords]);

  // --- State ---
  // Start blank, animation will transition from this
  const [displayedWords, setDisplayedWords] = useState<string[]>(blankWords);

  // --- Refs ---
  const isHoveredRef = useRef(isHovered);
  isHoveredRef.current = isHovered;
  const isAnimatingRef = useRef(isAnimating);
  isAnimatingRef.current = isAnimating;
  const componentJustMountedRef = useRef(true);

  // Refs for timers and intervals (separated for clarity)
  const scrambleIntervalsRef = useRef<{ [key: number]: NodeJS.Timeout }>({}); // Store interval IDs per word index
  const scrambleInTimeoutsRef = useRef<{ [key: number]: NodeJS.Timeout }>({}); // Timeouts for stagger-in
  const resolveTimeoutsRef = useRef<{ [key: number]: NodeJS.Timeout }>({}); // Timeouts for final reveal

  // --- Helper to Stop Animation ---
  const stopAndClearAnimation = useCallback(() => {
    // Clear all scramble intervals
    Object.values(scrambleIntervalsRef.current).forEach(clearInterval);
    scrambleIntervalsRef.current = {};

    // Clear all scramble-in timeouts
    Object.values(scrambleInTimeoutsRef.current).forEach(clearTimeout);
    scrambleInTimeoutsRef.current = {};

    // Clear all resolve timeouts
    Object.values(resolveTimeoutsRef.current).forEach(clearTimeout);
    resolveTimeoutsRef.current = {};

    if (isAnimatingRef.current) {
      setIsAnimating(false);
    }
  }, []); // No dependencies needed

  // --- Effect for InView Changes & Initial Animation ---
  useEffect(() => {
    const isCurrentlyBlank =
      JSON.stringify(displayedWords) === JSON.stringify(blankWords);
    const justMounted = componentJustMountedRef.current;

    if (inView) {
      // Trigger animation if mounting in view OR scrolling into view when blank
      if ((justMounted || isCurrentlyBlank) && !isAnimatingRef.current) {
        console.log("HoverTyper: In View & should animate");
        setIsAnimating(true);
      } else if (!isCurrentlyBlank && !isAnimatingRef.current) {
        // If comes into view already revealed (e.g., quick scroll out/in), just ensure correct text
        setDisplayedWords(originalWords);
      }
    } else {
      // Scrolling OUT of view
      if (!justMounted) {
        console.log("HoverTyper: Out of View");
        stopAndClearAnimation();
        if (!isCurrentlyBlank) {
          setDisplayedWords(blankWords); // Reset to blank
        }
        setIsHovered(false);
      }
    }

    if (justMounted) {
      componentJustMountedRef.current = false;
    }
  }, [
    inView,
    blankWords,
    originalWords,
    displayedWords,
    stopAndClearAnimation,
  ]);

  // --- Event Handlers ---
  const handleMouseEnter = () => {
    if (inView && !isAnimatingRef.current) {
      setIsHovered(true);
      setIsAnimating(true); // Trigger hover animation
    } else if (inView) {
      setIsHovered(true); // Track hover even if animating
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // --- Main Animation Effect ---
  useEffect(() => {
    if (!isAnimating || !originalWords.length) {
      return;
    }

    console.log("HoverTyper: Animation START");
    stopAndClearAnimation(); // Clear any previous timers before starting new ones
    setIsAnimating(true); // Re-assert animating state after clear

    // --- Animation Timing Parameters ---
    const staggerInCharDelay = 15; // ms delay per character for scramble appearance
    const baseStaggerInDelay = 0; // ms base delay for first scramble character
    const resolveCharDelay = 20; // ms delay per character for final reveal
    const baseResolveDelay = 200; // ms base delay for first reveal (ensure > stagger-in)
    const scrambleUpdateFrequency = 50; // ms interval for changing scrambled chars

    let charIndexOffset = 0;
    let maxResolveTime = 0;
    let lastWordIndexToResolve = -1;

    originalWords.forEach((wordOrSpace, wordIndex) => {
      if (wordOrSpace.trim() === "") {
        charIndexOffset += wordOrSpace.length; // Account for space length
        return; // Skip spaces, don't animate them
      }

      const word = wordOrSpace;
      const wordLength = word.length;

      // --- Calculate Delays ---
      const currentWordCharStartIndex = charIndexOffset;
      // When this word *starts* appearing (as scrambled)
      const scrambleInDelay =
        baseStaggerInDelay + currentWordCharStartIndex * staggerInCharDelay;
      // When this word *finishes* revealing its final characters
      const resolveDelay =
        baseResolveDelay +
        (currentWordCharStartIndex + wordLength - 1) * resolveCharDelay;

      if (resolveDelay > maxResolveTime) {
        maxResolveTime = resolveDelay;
        lastWordIndexToResolve = wordIndex;
      }

      // --- 1. Timeout for Staggered Scramble-In ---
      scrambleInTimeoutsRef.current[wordIndex] = setTimeout(() => {
        // Check if animation was cancelled before this timeout fired
        if (!isAnimatingRef.current) return;

        // Set this word to scrambled and start its interval
        setDisplayedWords((prev) => {
          const newWords = [...prev];
          // Initially scramble the word
          newWords[wordIndex] = word
            .split("")
            .map(() => getRandomChar())
            .join("");
          return newWords;
        });

        // Start the interval to continuously scramble *this word*
        scrambleIntervalsRef.current[wordIndex] = setInterval(() => {
          setDisplayedWords((prev) => {
            // Check if word is already resolved or animation stopped
            if (
              !isAnimatingRef.current ||
              !prev ||
              !prev[wordIndex] ||
              prev[wordIndex] === originalWords[wordIndex]
            ) {
              clearInterval(scrambleIntervalsRef.current[wordIndex]);
              delete scrambleIntervalsRef.current[wordIndex];
              return prev;
            }
            const newWords = [...prev];
            newWords[wordIndex] = word
              .split("")
              .map(() => getRandomChar())
              .join("");
            return newWords;
          });
        }, scrambleUpdateFrequency);
      }, scrambleInDelay);

      // --- 2. Timeout for Staggered Reveal ---
      resolveTimeoutsRef.current[wordIndex] = setTimeout(() => {
        // Check if animation was cancelled before this timeout fired
        if (!isAnimatingRef.current) return;

        // Stop the scrambling interval for this word
        if (scrambleIntervalsRef.current[wordIndex]) {
          clearInterval(scrambleIntervalsRef.current[wordIndex]);
          delete scrambleIntervalsRef.current[wordIndex];
        }

        // Set the word to its final, original state
        setDisplayedWords((prev) => {
          if (!prev) return prev;
          const newWords = [...prev];
          newWords[wordIndex] = originalWords[wordIndex];
          return newWords;
        });

        // --- Check if Last Word ---
        if (wordIndex === lastWordIndexToResolve) {
          console.log("HoverTyper: Animation END");
          queueMicrotask(() => {
            // Ensure state update is processed first
            if (isAnimatingRef.current) {
              setIsAnimating(false); // Mark animation as complete
            }
          });
        }
      }, resolveDelay);

      charIndexOffset += wordLength; // Update offset for the next word/space
    });

    // --- Effect Cleanup ---
    return () => {
      console.log("HoverTyper: Animation effect cleanup running");
      stopAndClearAnimation();
    };
  }, [isAnimating, originalWords, data, stopAndClearAnimation]); // Keep dependencies minimal

  // --- Render Logic ---
  // Use blankWords for initial structure and visibility comparison
  return (
    <HoverTyperWrapper
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={data}
      className="hover-typer"
    >
      <Inner>
        {blankWords.map((blankWordOrSpace, index) => {
          const wordOrSpace = displayedWords[index] ?? blankWordOrSpace; // Use displayed word if available
          const isSpace = originalWords[index]?.trim() === "";
          const isCurrentlyBlankWord =
            wordOrSpace === blankWordOrSpace && !isSpace;

          if (isSpace) {
            // Always render spaces, use original space for consistency
            return <span key={index}>{originalWords[index]}</span>;
          } else {
            // Render words/scrambled words
            return (
              <WordWrapper
                key={index}
                style={{
                  visibility: isCurrentlyBlankWord ? "hidden" : "visible",
                }}
              >
                {wordOrSpace.split("").map((char, charIndex) => (
                  <CharSpan key={charIndex} className="color-switch">
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
