import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { useTextScramble } from "../../../hooks/useTextScramble"; // Adjust import path

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
  min-height: 1.2em; /* Adjust based on line-height/font-size */
`;

const Inner = styled.div`
  display: flex;
  flex-wrap: wrap; // Allow words to wrap
  align-items: center;
`;

const WordWrapper = styled.span`
  display: inline-block;
  white-space: nowrap; // Keep chars within a word together
  margin-right: 0.1em; // Space between words
  &:last-child {
    margin-right: 0;
  }
`;

const CharSpan = styled.span`
  display: inline-block;
  white-space: pre; // Preserve spaces if needed within scramble
`;

// Non-breaking space character
const BLANK_CHAR = "\u00A0";

const HoverTyper = ({ data, inView }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  // State to trigger restarts
  const [animationNonce, setAnimationNonce] = useState(0);

  // Determine if the animation should be active
  const isAnimationActive = inView || isHovered;

  // Use the custom hook, passing the nonce as restartKey
  const displayedWords = useTextScramble(data, isAnimationActive, {
    restartKey: animationNonce, // Pass the nonce here
    resetToBlankOnInactive: true,
  });

  // Memoize the split original words/spaces only for rendering comparison
  const originalWordsForRender = useMemo(
    () => data.split(/(\s+)/).filter(Boolean),
    [data]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
    // If already in view when hover starts, increment nonce to force restart
    if (inView) {
      setAnimationNonce((prev) => prev + 1);
    }
    // If not inView, setting isHovered=true will make isAnimationActive=true,
    // naturally starting the animation via the hook's useEffect.
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Hook will react to isAnimationActive becoming false (if also !inView)
  };

  return (
    <HoverTyperWrapper
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={data}
      className="hover-typer"
    >
      <Inner>
        {/* Rendering logic remains the same */}
        {displayedWords.map((wordOrSpace, index) => {
          const isSpace = originalWordsForRender[index]?.trim() === "";

          if (isSpace) {
            return (
              <span style={{ whiteSpace: "pre" }} key={index}>
                {wordOrSpace}
              </span>
            );
          } else {
            const isCurrentlyBlankWord = wordOrSpace
              .split("")
              .every((char) => char === BLANK_CHAR);
            return (
              <WordWrapper
                key={index}
                style={{
                  visibility: isCurrentlyBlankWord ? "hidden" : "visible",
                }}
              >
                {wordOrSpace.split("").map((char, charIndex) => (
                  <CharSpan key={charIndex} className="color-switch">
                    {char}
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
