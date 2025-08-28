import { useEffect, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import throttle from "lodash.throttle";
import useViewportWidth from "../../../hooks/useViewportWidth";
import ControlsPanel from "../ControlsPanel";
import useWindowDimensions from "../../../hooks/useWindowDimensions";

const VideoControlsWrapper = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  z-index: 4;
  color: var(--colour-white);
  mix-blend-mode: difference;
`;

const Inner = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
`;

const wrapperVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      delay: 0.6,
    },
  },
};

const innerVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

type Props = {
  isMuted: boolean;
  isPlaying: boolean;
  currentTime: number;
  videoLength: number | undefined;
  setIsMuted: (isMuted: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  handleSeek: (time: number) => void;
};

const VideoControls = (props: Props) => {
  const {
    isMuted,
    isPlaying,
    currentTime,
    videoLength,
    setIsMuted,
    setIsPlaying,
    handleSeek,
  } = props;

  const [isActive, setIsActive] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const viewportWidth = useViewportWidth();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (viewportWidth === "tabletPortrait" || viewportWidth === "mobile") {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [viewportWidth]);

  useEffect(() => {
    let timeout: any;

    const body = document.querySelector("body");

    if (!body) return;

    if (!isActive) {
      body.classList.add("hide-cursor");
    } else {
      body.classList.remove("hide-cursor");
    }

    const handleInactive = () => {
      timeout = setTimeout(
        () => {
          setIsActive(false);
        },
        isMobile ? 4000 : 2000
      );
    };

    // Call handleInactive initially
    handleInactive();

    const handleActive = () => {
      clearTimeout(timeout);
      setIsActive(true);

      // Restart the timer when interaction happens
      handleInactive();
    };

    // Desktop: mouse movement
    const throttledHandleMouseMove = throttle(handleActive, 200);

    // Mobile: touch and click events
    const handleTouch = () => {
      handleActive();
    };

    // Add event listeners based on device type
    if (isMobile) {
      window.addEventListener("touchstart", handleTouch);
      window.addEventListener("click", handleTouch);
    } else {
      window.addEventListener("mousemove", throttledHandleMouseMove);
    }

    return () => {
      if (isMobile) {
        window.removeEventListener("touchstart", handleTouch);
        window.removeEventListener("click", handleTouch);
      } else {
        window.removeEventListener("mousemove", throttledHandleMouseMove);
      }
      clearTimeout(timeout);
    };
  }, [isActive, width, isMobile]);

  return (
    <AnimatePresence>
      <VideoControlsWrapper
        variants={wrapperVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        key={1}
      >
        <AnimatePresence>
          {isActive && (
            <Inner
              variants={innerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              key={2}
            >
              <ControlsPanel
                isMuted={isMuted}
                isPlaying={isPlaying}
                currentTime={currentTime}
                videoLength={videoLength}
                isMobile={isMobile}
                setIsMuted={setIsMuted}
                setIsPlaying={setIsPlaying}
                handleSeek={handleSeek}
                setIsActive={setIsActive}
              />
            </Inner>
          )}
        </AnimatePresence>
      </VideoControlsWrapper>
    </AnimatePresence>
  );
};

export default VideoControls;
