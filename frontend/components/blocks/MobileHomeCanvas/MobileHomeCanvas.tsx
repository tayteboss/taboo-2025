import React, { useState, useEffect, useMemo, useRef } from "react";
import styled, { useTheme } from "styled-components";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { HomePageType } from "../../../shared/types/types";
import CanvasCard from "../../elements/CanvasCard";
import LogoIcon from "../../svgs/LogoIcon";
import OverviewModal from "../OverviewModal";

// --- Styled Components ---

// Updated MobileHomeCanvasWrapper as provided
const MobileHomeCanvasWrapper = styled(motion.div)<{
  $animationComplete: boolean;
}>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  transform-origin: center center;
  z-index: 2;
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  transform: translate3d(0, 0, 0);
  transform: translateZ(0);

  /* NOTE: Displayed only at tabletPortrait and larger */
  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: block;
  }

  * {
    pointer-events: ${(props) =>
      props.$animationComplete ? "all" : "none"} !important;
  }
`;

// Other styled components remain the same as the previous mobile version
const Outer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  mix-blend-mode: difference;
  pointer-events: none; // Logo container doesn't block dragging

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    /* If the canvas is hidden below tabletPortrait, maybe hide the logo too? */
    /* Adjust visibility based on MobileHomeCanvasWrapper logic if needed */
  }
`;

const LogoWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  mix-blend-mode: soft-light;
  pointer-events: all; // Logo itself is interactive
  position: relative;
  z-index: 10;
`;

const MemoizedLogoInner = React.memo(styled.div`
  transition: all var(--transition-speed-default) var(--transition-ease);
  cursor: pointer;
  &:hover {
    transform: scale(1.03);
  }
  svg {
    width: clamp(200px, 50vw, 400px);
    height: auto;
  }
`);

const DragContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: grab;
  z-index: 1;
  &:active {
    cursor: grabbing;
  }
`;

const ItemWrapper = styled(motion.div)`
  position: absolute;
  will-change: transform;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  pointer-events: all;
`;

// --- Configuration (Unchanged) ---
const MAX_ITEMS_TO_DISPLAY = 20;
const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 30,
  mass: 1,
};
const manualLayoutConfig = [
  // ... (keep the original layout config)
  { top: "-50%", left: "25%", depthFactor: 0.8 },
  { top: "120%", left: "75%", depthFactor: 0.9 },
  { top: "75%", left: "-30%", depthFactor: 0.7 },
  { top: "70%", left: "95%", depthFactor: 1.0 },
  { top: "-30%", left: "110%", depthFactor: 0.85 },
  { top: "-25%", left: "-30%", depthFactor: 0.75 },
  { top: "60%", left: "120%", depthFactor: 0.95 },
  { top: "5%", left: "5%", depthFactor: 0.9 },
  { top: "115%", left: "35%", depthFactor: 0.8 },
  { top: "20%", left: "-20%", depthFactor: 0.7 },
  { top: "45%", left: "70%", depthFactor: 0.85 },
  { top: "15%", left: "115%", depthFactor: 0.95 },
  { top: "75%", left: "55%", depthFactor: 0.8 },
  { top: "115%", left: "112%", depthFactor: 0.9 },
  { top: "-15%", left: "35%", depthFactor: 0.7 },
  { top: "60%", left: "-10%", depthFactor: 0.75 },
  { top: "25%", left: "40%", depthFactor: 0.95 },
  { top: "110%", left: "0%", depthFactor: 0.8 },
  { top: "65%", left: "25%", depthFactor: 0.85 },
  { top: "-20%", left: "75%", depthFactor: 0.9 },
  { top: "90%", left: "-15%", depthFactor: 0.7 },
];

// --- Helper Function (Unchanged) ---
const seededRandomRange = (seed: number, min: number, max: number): number => {
  const random = Math.sin(seed) * 10000;
  const normalized = random - Math.floor(random);
  return min + normalized * (max - min);
};

type Props = { data: HomePageType["items"] };

// --- Component Implementation ---
const MobileHomeCanvas = React.memo((props: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [overviewModal, setOverviewModal] = useState<false | number>(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize(); // Initial call
    // Set initial values to avoid constraint issues on first render if possible
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsToRender = useMemo(() => {
    return props.data
      ? props.data.slice(
          0,
          Math.min(MAX_ITEMS_TO_DISPLAY, manualLayoutConfig.length)
        )
      : [];
  }, [props.data]);

  const hasData = useMemo(() => itemsToRender.length > 0, [itemsToRender]);

  const canvasVariants = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 1.6 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: "easeInOut", delay: 1.5 },
      },
    }),
    []
  );

  const logoVariants = useMemo(
    () => ({
      hidden: { scale: 1, opacity: 0 },
      visible: {
        scale: 0.5,
        opacity: 1,
        transition: {
          scale: { duration: 0.8, ease: "easeInOut", delay: 1.6 },
          opacity: { duration: 0.8, ease: "easeInOut", delay: 0.4 },
        },
      },
    }),
    []
  );

  const logoCrossfadeTransition = useMemo(
    () => ({
      opacity: { duration: 0.01, ease: "easeInOut" },
      scale: { duration: 0.5, ease: "easeInOut" },
    }),
    []
  );

  const itemConfigs = useMemo(() => {
    return itemsToRender.map((item, index) => {
      const layout = manualLayoutConfig[index];
      const { top, left, depthFactor } = layout;
      const itemKey = item?.id ?? `item-${index}`;
      const randomSeed = index + 1;
      const initialScale = seededRandomRange(randomSeed * 1.1, 1.2, 1.6);
      const staggerDelay = 1.7 + seededRandomRange(randomSeed * 1.2, 0, 0.5);
      const itemInitialState = { x: 0, y: 0, scale: initialScale, opacity: 0 };
      const itemAnimateState = { x: 0, y: 0, scale: 1, opacity: 1 };
      const itemTransitionConfig = {
        scale: { ...springTransition, delay: staggerDelay },
        opacity: { duration: 0.5, ease: "easeIn", delay: staggerDelay },
      };
      return {
        key: itemKey,
        initialTop: top,
        initialLeft: left,
        itemInitial: itemInitialState,
        itemAnimate: itemAnimateState,
        itemTransition: itemTransitionConfig,
        title: item.title,
        description: item.description,
        link: item.link,
        media: item.media,
        project: item.project,
        year: item.year,
        useProjectReference: item.useProjectReference,
        depthFactor: depthFactor,
      };
    });
  }, [itemsToRender]);

  const dragConstraints = useMemo(() => {
    if (!windowSize.width || !windowSize.height) {
      return { top: 0, left: 0, right: 0, bottom: 0 };
    }
    const minLeftPercent = -30,
      maxLeftPercent = 120;
    const minTopPercent = -50,
      maxTopPercent = 120;
    // Ensure buffer doesn't make limits positive when they should be negative etc.
    const buffer = 50; // Smaller buffer might feel better
    const leftLimit = Math.min(
      0,
      -(maxLeftPercent / 100) * windowSize.width - buffer
    );
    const rightLimit = Math.max(
      windowSize.width,
      (1 - minLeftPercent / 100) * windowSize.width + buffer
    );
    const topLimit = Math.min(
      0,
      -(maxTopPercent / 100) * windowSize.height - buffer
    );
    const bottomLimit = Math.max(
      windowSize.height,
      (1 - minTopPercent / 100) * windowSize.height + buffer
    );

    // Recalculate limits considering the content size relative to viewport
    const contentWidth =
      windowSize.width * (maxLeftPercent / 100 - minLeftPercent / 100); // Approx content width
    const contentHeight =
      windowSize.height * (maxTopPercent / 100 - minTopPercent / 100); // Approx content height

    // Constraints: How far the *container's* top-left corner can move from (0,0)
    // Left constraint (max negative X): Stop when right edge of content hits right edge of viewport
    const finalLeft =
      -(
        contentWidth -
        windowSize.width +
        (minLeftPercent / 100) * windowSize.width
      ) - buffer; // Should be negative or 0
    // Right constraint (max positive X): Stop when left edge of content hits left edge of viewport
    const finalRight = -((minLeftPercent / 100) * windowSize.width) + buffer; // Should be positive or 0

    // Top constraint (max negative Y): Stop when bottom edge of content hits bottom edge of viewport
    const finalTop =
      -(
        contentHeight -
        windowSize.height +
        (minTopPercent / 100) * windowSize.height
      ) - buffer; // Should be negative or 0
    // Bottom constraint (max positive Y): Stop when top edge of content hits top edge of viewport
    const finalBottom = -((minTopPercent / 100) * windowSize.height) + buffer; // Should be positive or 0

    return {
      left: finalLeft < 0 ? finalLeft : 0, // Ensure constraints don't allow moving content fully off-screen unnecessarily
      right: finalRight > 0 ? finalRight : 0,
      top: finalTop < 0 ? finalTop : 0,
      bottom: finalBottom > 0 ? finalBottom : 0,
    };
  }, [windowSize.width, windowSize.height]);

  const theme = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const handleLightSwitch = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      // Set CSS variables based on newMode
      document.documentElement.style.setProperty(
        "--colour-background",
        newMode ? theme.colours.black : theme.colours.white
      );
      document.documentElement.style.setProperty(
        "--colour-background-alpha-80",
        newMode ? theme.colours.blackAlpha80 : theme.colours.whiteAlpha80
      );
      // ... (set other colour variables) ...
      document.documentElement.style.setProperty(
        "--colour-foreground",
        newMode ? theme.colours.white : theme.colours.black
      );
      document.documentElement.style.setProperty(
        "--colour-foreground-alpha-80",
        newMode ? theme.colours.whiteAlpha80 : theme.colours.blackAlpha80
      );
      // ... (set other colour variables) ...
      document.documentElement.style.setProperty(
        "--colour-background-alpha-50",
        newMode ? theme.colours.blackAlpha50 : theme.colours.whiteAlpha50
      );
      document.documentElement.style.setProperty(
        "--colour-background-alpha-20",
        newMode ? theme.colours.blackAlpha20 : theme.colours.whiteAlpha20
      );
      document.documentElement.style.setProperty(
        "--colour-foreground-alpha-50",
        newMode ? theme.colours.whiteAlpha50 : theme.colours.blackAlpha50
      );
      document.documentElement.style.setProperty(
        "--colour-foreground-alpha-20",
        newMode ? theme.colours.whiteAlpha20 : theme.colours.blackAlpha20
      );
      return newMode;
    });
  };

  // --- Render ---
  return (
    <>
      {/* Logo (Consider conditional rendering based on viewport if needed) */}
      {/* Conditionally render Outer based on windowSize or a state reflecting if it should be visible */}
      {windowSize.width >=
      /* your theme.mediaBreakpoints.tabletPortrait threshold value */ 768 ? ( // Example threshold
        <Outer animate={{ scale: 1 }} transition={logoCrossfadeTransition}>
          <LogoWrapper
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            onClick={() => handleLightSwitch()}
          >
            <MemoizedLogoInner>
              <LogoIcon />
            </MemoizedLogoInner>
          </LogoWrapper>
        </Outer>
      ) : null}

      {/* Main wrapper for entry animation & visibility control */}
      <MobileHomeCanvasWrapper
        variants={canvasVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={() => setAnimationComplete(true)}
        $animationComplete={animationComplete}
      >
        {/* Draggable Container */}
        <DragContainer
          drag
          dragConstraints={dragConstraints}
          dragElasticity={0.1} // Controls bounce at edges
          // dragMomentum={false} // <-- REMOVE this line to re-enable momentum

          // v-- ADD or MODIFY this line --v
          dragTransition={{
            // Define the animation after drag release
            type: "inertia", // Use inertia (based on velocity) - default
            // Adjust these parameters to control the animation duration and feel:
            power: 0.8, // Lower -> faster velocity decay (default 0.8)
            timeConstant: 300, // Lower -> shorter duration (default 700ms)
            // You can also adjust bounce at constraints if needed:
            bounceStiffness: 300, // Stiffness of bounce at edges (default 500)
            bounceDamping: 40, // Damping of bounce at edges (default 10)
            // modifyTarget: target => Math.round(target / 50) * 50 // Example: Snap to grid
          }}
          // ^-- ADD or MODIFY this line --^

          style={{ x: dragX, y: dragY }}
        >
          {/* Render Items */}
          {hasData &&
            itemConfigs.map((config, i) => (
              <ItemWrapper
                key={`item-${config.key}-${i}`}
                style={{ top: config.initialTop, left: config.initialLeft }}
                initial={config.itemInitial}
                animate={config.itemAnimate}
                transition={config.itemTransition}
              >
                <CanvasCard
                  description={config.description}
                  link={config.link}
                  media={config.media}
                  project={config.project}
                  title={config.title}
                  useProjectReference={config.useProjectReference}
                  isHovered={isHovered}
                  index={i}
                  setIsHovered={setIsHovered}
                  setOverviewModal={setOverviewModal}
                />
              </ItemWrapper>
            ))}
        </DragContainer>
      </MobileHomeCanvasWrapper>

      {/* Overview Modal */}
      <OverviewModal
        isActive={!!overviewModal}
        data={overviewModal ? props.data[overviewModal]?.project : false}
        setOverviewModal={setOverviewModal}
      />
    </>
  );
});

export default MobileHomeCanvas;
