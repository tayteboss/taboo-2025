import { useState, useEffect, useRef, useCallback } from "react";

// Helpers remain the same
const getRandomChar = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomIndex = Math.floor(Math.random() * chars.length);
  return chars[randomIndex];
};
const BLANK_CHAR = "\u00A0";

type ScrambleOptions = {
  charRevealDelayMs?: number;
  baseRevealDelayMs?: number;
  scrambleIntervalMs?: number;
  resetToBlankOnInactive?: boolean;
  restartKey?: number | string; // Add restartKey
};

const defaultOptions: Required<Omit<ScrambleOptions, "restartKey">> = {
  // Omit restartKey from defaults
  charRevealDelayMs: 50,
  baseRevealDelayMs: 100,
  scrambleIntervalMs: 50,
  resetToBlankOnInactive: true,
};

export const useTextScramble = (
  text: string,
  isActive: boolean,
  options?: ScrambleOptions
): string[] => {
  const {
    charRevealDelayMs,
    baseRevealDelayMs,
    scrambleIntervalMs,
    resetToBlankOnInactive,
    restartKey, // Destructure restartKey
  } = { ...defaultOptions, ...options };

  const originalWords = useRef<string[]>([]);
  const blankWords = useRef<string[]>([]);

  // Effect to parse text into words/blank representation
  useEffect(() => {
    const words = text.split(/(\s+)/).filter(Boolean);
    originalWords.current = words;
    blankWords.current = words.map((wordOrSpace) =>
      wordOrSpace.trim() === ""
        ? wordOrSpace
        : BLANK_CHAR.repeat(wordOrSpace.length)
    );
    // Initialize based on initial active state and reset flag
    setDisplayedWords(
      resetToBlankOnInactive && !isActive
        ? blankWords.current
        : originalWords.current
    );
  }, [text]); // Only depends on text now

  const [displayedWords, setDisplayedWords] = useState<string[]>(
    resetToBlankOnInactive ? blankWords.current : originalWords.current
  );

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const revealedCharsCountRef = useRef<number>(0);
  const totalNonSpaceCharsRef = useRef<number>(0);

  // Calculate total non-space chars
  useEffect(() => {
    totalNonSpaceCharsRef.current = originalWords.current.reduce(
      (count, wordOrSpace) =>
        wordOrSpace.trim() === "" ? count : count + wordOrSpace.length,
      0
    );
  }, [text]);

  // --- Animation Loop (runAnimation) remains the same ---
  const runAnimation = useCallback(
    /* ... (keep the existing runAnimation logic) ... */
    (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsedTime = timestamp - startTimeRef.current;
      const targetRevealedCount = Math.max(
        0,
        Math.floor((elapsedTime - baseRevealDelayMs) / charRevealDelayMs)
      );

      // Determine if an update is needed based on revealed count or scramble necessity
      const needsUpdate = targetRevealedCount > revealedCharsCountRef.current;
      // Only scramble periodically based on interval to reduce updates
      const shouldScramble =
        targetRevealedCount < totalNonSpaceCharsRef.current &&
        (timestamp - (startTimeRef.current ?? timestamp)) % scrambleIntervalMs <
          1000 / 60; // Check roughly within scramble interval frame

      if (needsUpdate || shouldScramble) {
        revealedCharsCountRef.current = targetRevealedCount;
        let currentNonSpaceIndex = 0;
        let isFullyRevealed = true; // Assume fully revealed initially

        const nextDisplayedWords = originalWords.current.map((wordOrSpace) => {
          if (wordOrSpace.trim() === "") {
            return wordOrSpace; // Keep spaces
          }

          const wordChars = wordOrSpace.split("").map((originalChar, i) => {
            const overallCharIndex = currentNonSpaceIndex + i;
            if (overallCharIndex < targetRevealedCount) {
              return originalChar; // Reveal this character
            } else {
              isFullyRevealed = false; // Not fully revealed yet
              return getRandomChar(); // Scramble this character
            }
          });
          currentNonSpaceIndex += wordOrSpace.length;
          return wordChars.join("");
        });

        setDisplayedWords(nextDisplayedWords);

        // Continue animation if not fully revealed
        if (!isFullyRevealed) {
          animationFrameRef.current = requestAnimationFrame(runAnimation);
        } else {
          // Animation finished naturally
          startTimeRef.current = null;
          revealedCharsCountRef.current = 0;
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          // Ensure final state is correct just in case
          setDisplayedWords(originalWords.current);
        }
      } else if (targetRevealedCount < totalNonSpaceCharsRef.current) {
        // Still needs revealing but no state update this frame, continue loop
        animationFrameRef.current = requestAnimationFrame(runAnimation);
      } else {
        // Animation finished (target reached total chars)
        startTimeRef.current = null;
        revealedCharsCountRef.current = 0;
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        // Ensure final state is correct
        setDisplayedWords(originalWords.current);
      }
    },
    [baseRevealDelayMs, charRevealDelayMs, scrambleIntervalMs]
  );

  // --- Effect to control animation start/stop/restart ---
  useEffect(() => {
    // Stop any previous animation frame before deciding action
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (isActive) {
      // --- Start or Restart Animation ---
      // Reset time and progress refs
      startTimeRef.current = null;
      revealedCharsCountRef.current = 0;
      // Set to blank state immediately before starting animation
      setDisplayedWords(blankWords.current);
      // Use RAF to ensure blank state renders before animation starts
      requestAnimationFrame(() => {
        // Double check isActive, in case it changed between render and RAF
        if (isActive) {
          animationFrameRef.current = requestAnimationFrame(runAnimation);
        }
      });
    } else {
      // --- Stop Animation and Reset ---
      startTimeRef.current = null;
      revealedCharsCountRef.current = 0;
      // Reset to blank or original state when inactive
      setDisplayedWords(
        resetToBlankOnInactive ? blankWords.current : originalWords.current
      );
    }

    // Cleanup function: always stop animation on unmount or before effect re-runs
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
        startTimeRef.current = null;
        revealedCharsCountRef.current = 0;
      }
    };
    // Add restartKey to dependencies: changing it while isActive=true will re-run the effect
  }, [isActive, runAnimation, resetToBlankOnInactive, restartKey, text]); // Add text dependency here to ensure blankWords/originalWords refs used inside are current

  return displayedWords;
};
