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
  noHoverAnimation?: boolean;
};

// Styled components remain the same
const HoverTyperWrapper = styled.div`
  position: relative;
  display: inline-block;
  display: flex;
  align-items: center;
  cursor: default;
  min-height: 1.1em;
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
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const randomIndex = Math.floor(Math.random() * chars.length);
  return chars[randomIndex];
};

const BLANK_CHAR = "\u00A0"; // Non-breaking space

const HoverTyper = ({ data, inView, noHoverAnimation = false }: Props) => {
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
  const [displayedWords, setDisplayedWords] = useState<string[]>(blankWords);

  // --- Refs ---
  const isHoveredRef = useRef(isHovered);
  isHoveredRef.current = isHovered;
  const isAnimatingRef = useRef(isAnimating);
  isAnimatingRef.current = isAnimating;
  const componentJustMountedRef = useRef(true);
  // Ref to track the target state of the animation ('original' or 'blank')
  const animationTargetRef = useRef<"original" | "blank">("blank");

  // Refs for timers and intervals
  const scrambleIntervalsRef = useRef<{ [key: number]: NodeJS.Timeout }>({});
  const scrambleInTimeoutsRef = useRef<{ [key: number]: NodeJS.Timeout }>({});
  const resolveTimeoutsRef = useRef<{ [key: number]: NodeJS.Timeout }>({});

  // --- Helper to Stop Animation Timers ---
  // Modified to ONLY clear timers, not change animation state directly
  const stopAndClearAnimationTimers = useCallback(() => {
    Object.values(scrambleIntervalsRef.current).forEach(clearInterval);
    scrambleIntervalsRef.current = {};
    Object.values(scrambleInTimeoutsRef.current).forEach(clearTimeout);
    scrambleInTimeoutsRef.current = {};
    Object.values(resolveTimeoutsRef.current).forEach(clearTimeout);
    resolveTimeoutsRef.current = {};
  }, []); // No dependencies needed

  // --- Effect for InView Changes & Triggering Animations ---
  useEffect(() => {
    const isCurrentlyBlank =
      JSON.stringify(displayedWords) === JSON.stringify(blankWords);
    const isCurrentlyOriginal =
      JSON.stringify(displayedWords) === JSON.stringify(originalWords);
    const justMounted = componentJustMountedRef.current;

    if (inView) {
      // === SCROLLING INTO VIEW ===
      if (isAnimatingRef.current && animationTargetRef.current === "blank") {
        // Interrupting an "out" animation to animate "in"
        stopAndClearAnimationTimers(); // Clear existing timers first
        animationTargetRef.current = "original";
        // isAnimating is already true, the main effect will re-run or continue
        // We need to ensure it restarts cleanly - setting state triggers re-run
        setIsAnimating(false); // Momentarily set to false
        queueMicrotask(() => setIsAnimating(true)); // Then true to re-trigger effect cleanly
      } else if (!isAnimatingRef.current && !isCurrentlyOriginal) {
        // Not animating, and not showing original text (e.g., blank or partially revealed)
        animationTargetRef.current = "original"; // Target the original text
        setIsAnimating(true); // Start the "in" animation
      }
      // else: already animating IN, or already showing original text -> do nothing
    } else {
      // === SCROLLING OUT OF VIEW ===
      if (!justMounted) {
        if (
          isAnimatingRef.current &&
          animationTargetRef.current === "original"
        ) {
          // Interrupting an "in" animation to animate "out"
          stopAndClearAnimationTimers(); // Clear existing timers first
          animationTargetRef.current = "blank";
          // isAnimating is already true, re-trigger effect cleanly
          setIsAnimating(false);
          queueMicrotask(() => setIsAnimating(true));
        } else if (!isAnimatingRef.current && isCurrentlyOriginal) {
          // Not animating, and currently showing the original text
          animationTargetRef.current = "blank"; // Target the blank state
          setIsAnimating(true); // Start the "out" animation
        }
        // else: already animating OUT, or already blank -> do nothing

        setIsHovered(false); // Always reset hover state when out of view
      }
    }

    if (justMounted) {
      componentJustMountedRef.current = false;
    }
    // Add stopAndClearAnimationTimers to dependencies
  }, [
    inView,
    displayedWords,
    originalWords,
    blankWords,
    stopAndClearAnimationTimers,
  ]);

  // --- Event Handlers ---
  const handleMouseEnter = () => {
    // Only trigger hover animation if:
    // 1. Component is in view
    // 2. Not currently animating
    // 3. Hover animation is NOT disabled
    if (inView && !isAnimatingRef.current && !noHoverAnimation) {
      // Hover animation always targets the original text
      animationTargetRef.current = "original";
      setIsHovered(true);
      setIsAnimating(true); // Trigger hover animation
    } else if (inView) {
      setIsHovered(true); // Set hover state even if not animating hover effect
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // We don't trigger the "out" animation on mouse leave, only when scrolling out of view.
  };

  // --- Main Animation Effect ---
  useEffect(() => {
    // Guard: Don't run if not animating or no words
    if (!isAnimating || !originalWords.length) {
      return;
    }

    // Capture the target for this specific animation run
    const currentAnimationTarget = animationTargetRef.current;

    // Clear any previous timers (e.g., from interrupted animations)
    stopAndClearAnimationTimers();

    // --- Animation Timing Parameters --- (Remain the same)
    const staggerInCharDelay = 15;
    const baseStaggerInDelay = 0;
    const resolveCharDelay = 20;
    const baseResolveDelay = 200; // Adjust baseResolveDelay if needed for 'out' anim
    const scrambleUpdateFrequency = 50;

    let charIndexOffset = 0;
    let maxResolveTime = 0;
    let lastWordIndexToResolve = -1;

    originalWords.forEach((wordOrSpace, wordIndex) => {
      if (wordOrSpace.trim() === "") {
        charIndexOffset += wordOrSpace.length;
        return; // Skip spaces
      }

      const word = wordOrSpace;
      const wordLength = word.length;
      const currentWordCharStartIndex = charIndexOffset;
      const scrambleInDelay =
        baseStaggerInDelay + currentWordCharStartIndex * staggerInCharDelay;
      const resolveDelay =
        baseResolveDelay +
        (currentWordCharStartIndex + wordLength - 1) * resolveCharDelay;

      if (resolveDelay > maxResolveTime) {
        maxResolveTime = resolveDelay;
        lastWordIndexToResolve = wordIndex;
      }

      // --- 1. Timeout for Staggered Scramble Start ---
      scrambleInTimeoutsRef.current[wordIndex] = setTimeout(() => {
        // Check if animation state is still valid for this run
        if (
          !isAnimatingRef.current ||
          animationTargetRef.current !== currentAnimationTarget
        )
          return;

        setDisplayedWords((prev) => {
          const newWords = [...prev];
          // Ensure the word exists before scrambling
          if (newWords[wordIndex] !== undefined) {
            newWords[wordIndex] = word
              .split("")
              .map(() => getRandomChar())
              .join("");
          }
          return newWords;
        });

        // --- Start Scramble Interval ---
        scrambleIntervalsRef.current[wordIndex] = setInterval(() => {
          setDisplayedWords((prev) => {
            // Check if animation state is still valid for this run before updating
            if (
              !isAnimatingRef.current ||
              animationTargetRef.current !== currentAnimationTarget ||
              !prev ||
              !prev[wordIndex]
            ) {
              clearInterval(scrambleIntervalsRef.current[wordIndex]);
              delete scrambleIntervalsRef.current[wordIndex];
              return prev;
            }

            // Determine target word for check (original or blank)
            const targetWord =
              currentAnimationTarget === "original"
                ? originalWords[wordIndex]
                : blankWords[wordIndex];

            // If word somehow already matches target, stop interval
            if (prev[wordIndex] === targetWord) {
              clearInterval(scrambleIntervalsRef.current[wordIndex]);
              delete scrambleIntervalsRef.current[wordIndex];
              return prev;
            }

            // Otherwise, update with random chars
            const newWords = [...prev];
            newWords[wordIndex] = word
              .split("")
              .map(() => getRandomChar())
              .join("");
            return newWords;
          });
        }, scrambleUpdateFrequency);
      }, scrambleInDelay);

      // --- 2. Timeout for Staggered Resolve ---
      resolveTimeoutsRef.current[wordIndex] = setTimeout(() => {
        // Check if animation state is still valid for this run
        if (
          !isAnimatingRef.current ||
          animationTargetRef.current !== currentAnimationTarget
        )
          return;

        // Stop the scrambling interval for this specific word
        if (scrambleIntervalsRef.current[wordIndex]) {
          clearInterval(scrambleIntervalsRef.current[wordIndex]);
          delete scrambleIntervalsRef.current[wordIndex];
        }

        // Set the word to its final TARGET state (original or blank)
        setDisplayedWords((prev) => {
          if (!prev) return prev;
          const newWords = [...prev];
          newWords[wordIndex] =
            currentAnimationTarget === "original"
              ? originalWords[wordIndex]
              : blankWords[wordIndex]; // Resolve to blank if animating out
          return newWords;
        });

        // --- Check if Last Word Resolved ---
        if (wordIndex === lastWordIndexToResolve) {
          queueMicrotask(() => {
            // Check if the animation completed naturally for the intended target
            if (
              isAnimatingRef.current &&
              animationTargetRef.current === currentAnimationTarget
            ) {
              setIsAnimating(false); // Mark animation as complete
            }
            // If target changed or isAnimating became false externally, do nothing here
          });
        }
      }, resolveDelay);

      charIndexOffset += wordLength; // Update offset for next word/space
    });

    // --- Effect Cleanup ---
    // Clears timers if the component unmounts OR if `isAnimating` becomes false
    // OR if dependencies change causing the effect to re-run.
    return () => {
      stopAndClearAnimationTimers();
    };
    // Dependencies: Run when `isAnimating` changes, or if key data changes.
  }, [
    isAnimating,
    originalWords,
    blankWords,
    data,
    stopAndClearAnimationTimers,
  ]);

  // --- Render Logic --- (Remains the same)
  return (
    <HoverTyperWrapper
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={data}
      className="hover-typer"
    >
      <Inner>
        {blankWords.map((blankWordOrSpace, index) => {
          const wordOrSpace = displayedWords[index] ?? blankWordOrSpace;
          const isSpace = originalWords[index]?.trim() === "";
          // Determine visibility based on comparing with the underlying blank structure
          const isCurrentlyBlankWord =
            wordOrSpace === blankWords[index] && !isSpace;

          if (isSpace) {
            return <span key={index}>{originalWords[index]}</span>;
          } else {
            return (
              <WordWrapper
                key={index}
                // Hide if it's currently identical to the blank version
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
