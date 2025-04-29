import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useMousePosition } from "../../../hooks/useMousePosition";
import pxToRem from "../../../utils/pxToRem";

type Props = {
  cursorRefresh: () => void;
  appCursorRefresh: number;
};

type StyledProps = {
  $isActive?: boolean;
  $isOnDevice?: boolean;
};

const CursorWrapper = styled.div<StyledProps>`
  z-index: 1000;
  position: fixed;
  display: ${(props) => (props.$isOnDevice ? "none" : "block")};
  mix-blend-mode: difference;

  @media ${(props) => props.theme.mediaBreakpoints.mobile} {
    display: none;
  }
`;

const CursorFloatingButton = styled(motion.div)<StyledProps>`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 16px;
  left: 30px;
  height: auto;
  padding: 0 ${pxToRem(24)};
  pointer-events: none;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: var(--colour-background);
  border-radius: ${pxToRem(5)};
  padding: ${pxToRem(6)} ${pxToRem(12)};
  color: var(--colour-foreground);
  white-space: nowrap;
  transform-origin: center left;
  opacity: ${(props) => (props.$isActive ? 1 : 0)};

  transition:
    top 500ms ease,
    left 500ms ease,
    height 500ms ease,
    width 500ms ease,
    opacity 300ms ease;
`;

const Cursor = ({ cursorRefresh, appCursorRefresh }: Props) => {
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isOnDevice, setIsOnDevice] = useState(false);
  const [isHoveringNextProjectLink, setIsHoveringNextProjectLink] =
    useState(false);

  const router = useRouter();
  const position = useMousePosition();

  let mouseXPosition = position.x;
  let mouseYPosition = position.y;

  const variantsWrapper = {
    visible: {
      x: mouseXPosition,
      y: mouseYPosition,
      transition: {
        type: "spring",
        mass: 0.01,
        stiffness: 200,
        damping: 10,
        overshootClamping: false,
        restDelta: 0.01,
        ease: "linear",
      },
    },
    hidden: {
      x: mouseXPosition,
      y: mouseYPosition,
      transition: {
        type: "spring",
        mass: 0.01,
        stiffness: 200,
        damping: 10,
        overshootClamping: false,
        restDelta: 0.01,
        ease: "linear",
      },
    },
  };

  const clearCursor = () => {
    setIsHoveringLink(false);
    setIsOnDevice(false);
  };

  const findActions = () => {
    const aLinks = document.querySelectorAll("a");
    const cursorLinks = document.querySelectorAll(".cursor-link");
    const floatingButtons = document.querySelectorAll(".cursor-next-project");

    floatingButtons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        setIsHoveringNextProjectLink(true);
        setCursorText("Next Project (↗)");
      });
      button.addEventListener("mouseleave", () => {
        setIsHoveringNextProjectLink(false);
        setCursorText("Next Project (↗)");
      });
      button.addEventListener("mouseup", () => {
        setIsHoveringNextProjectLink(false);
        setCursorText("Next Project (↗)");
      });
    });

    cursorLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        setIsHoveringLink(true);
      });
      link.addEventListener("mouseleave", () => {
        setIsHoveringLink(false);
      });
      link.addEventListener("mouseup", () => {
        setIsHoveringLink(false);
      });
    });

    aLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        setIsHoveringLink(true);
      });
      link.addEventListener("mouseleave", () => {
        setIsHoveringLink(false);
      });
      link.addEventListener("mouseup", () => {
        setIsHoveringLink(false);
      });
    });

    // checking if on a device
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      setIsOnDevice(true);
    } else if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      setIsOnDevice(true);
    }
  };

  useEffect(() => {
    findActions();

    const timer = setTimeout(() => {
      findActions();
    }, 1000);

    return function cleanUp() {
      clearCursor();
      clearTimeout(timer);
    };
  }, [cursorRefresh, appCursorRefresh]);

  // reset cursor on page change
  useEffect(() => {
    clearCursor();
  }, [router.pathname, router.asPath, router.query.slug, cursorRefresh]);

  return (
    <>
      <CursorWrapper $isOnDevice={isOnDevice} className="cursor-wrapper">
        <CursorFloatingButton
          $isActive={isHoveringNextProjectLink}
          $autoWidth={!!cursorText}
          variants={variantsWrapper}
          animate="visible"
          layout
          className="type-mono-small"
        >
          {cursorText || ""}
        </CursorFloatingButton>
      </CursorWrapper>
    </>
  );
};

export default Cursor;
