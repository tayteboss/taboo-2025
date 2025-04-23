import React, { useState, useEffect, useMemo, useCallback } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

// Adjust import paths as needed
import { HomePageType } from "../../../shared/types/types";
// Removed useMousePosition hook
// import { useMousePosition } from "../../../hooks/useMousePosition";
import CanvasCard from "../../elements/CanvasCard"; // Assume CanvasCard is memoized
import LogoIcon from "../../svgs/LogoIcon";

// --- Styled Components (Largely Unchanged, minor tweaks possible) ---

// Consider if 'overflow: hidden' is still desired. If items parallax
// outside the viewport due to scroll, they will be clipped.
// If you want them visible, you might need a different approach.
const HomeCanvasWrapper = styled(motion.div)<{ $animationComplete: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden; // Keep or remove based on desired effect
  transform-origin: center center;
  z-index: 2;
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  transform: translate3d(0, 0, 0);
  transform: translateZ(0);
  display: none;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: block;
  }

  /* Pointer events might need adjustment based on mobile interaction */
  * {
    pointer-events: ${(props) =>
      props.$animationComplete ? "all" : "none"} !important;
  }
`;

// We might simplify Outer/Inner if hover effect is removed/changed for mobile
const Inner = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1; // Logo background layer
  display: flex;
  justify-content: center;
  align-items: center;
  mix-blend-mode: normal; // Or adjust blend mode if needed
  pointer-events: none;
`;

const LogoWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  mix-blend-mode: soft-light; // Or adjust blend mode
`;

const MemoizedLogoInner = React.memo(styled.div`
  svg {
    /* Adjust logo size for mobile if needed */
    width: 90vw; /* Example: Slightly smaller for mobile */
    max-width: 500px; /* Example: Add max width */
    height: auto;
  }
`);

const ItemWrapper = styled(motion.div)`
  position: absolute;
  will-change: transform;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2; // Items above logo
`;

// --- Configuration (Unchanged, but BASE_PARALLAX_STRENGTH might need tuning) ---
const MAX_ITEMS_TO_DISPLAY = 20;
// Might need to adjust strength for scroll sensitivity
const BASE_PARALLAX_STRENGTH = 1000; // Reduced slightly as an example
const LOGO_DEPTH_FACTOR = 0.1;

const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 30,
  mass: 1,
};

// Manual layout - may need adjustments for typical mobile aspect ratios
const manualLayoutConfig = [
  { top: "-40%", left: "15%", depthFactor: 0.8 }, // Adjusted some positions slightly
  { top: "110%", left: "65%", depthFactor: 0.9 },
  { top: "70%", left: "-20%", depthFactor: 0.7 },
  { top: "65%", left: "85%", depthFactor: 1.0 },
  { top: "-20%", left: "115%", depthFactor: 0.85 },
  { top: "-15%", left: "-20%", depthFactor: 0.75 },
  { top: "55%", left: "118%", depthFactor: 0.95 },
  { top: "0%", left: "5%", depthFactor: 0.9 },
  { top: "115%", left: "25%", depthFactor: 0.8 },
  { top: "15%", left: "-10%", depthFactor: 0.7 },
  { top: "40%", left: "60%", depthFactor: 0.85 },
  { top: "10%", left: "110%", depthFactor: 0.95 },
  { top: "70%", left: "45%", depthFactor: 0.8 },
  { top: "120%", left: "110%", depthFactor: 0.9 },
  { top: "-10%", left: "25%", depthFactor: 0.7 },
  { top: "55%", left: "0%", depthFactor: 0.75 },
  { top: "20%", left: "30%", depthFactor: 0.95 },
  { top: "110%", left: "-15%", depthFactor: 0.8 },
  { top: "50%", left: "20%", depthFactor: 0.85 },
  { top: "-15%", left: "65%", depthFactor: 0.9 },
  { top: "85%", left: "-5%", depthFactor: 0.7 },
];

// --- Helper Function (Unchanged) ---
const seededRandomRange = (seed: number, min: number, max: number): number => {
  const random = Math.sin(seed) * 10000;
  const normalized = random - Math.floor(random);
  return min + normalized * (max - min);
};

type Props = { data: HomePageType["items"] };

// --- mobileHomeCanvas Component ---
const MobileHomeCanvas = React.memo((props: Props) => {
  // State for animation completion and window size (still relevant)
  const [animationComplete, setAnimationComplete] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  // State for scroll position
  const [scrollY, setScrollY] = useState(0);
  // State for total scrollable height (needed for normalization)
  const [scrollableHeight, setScrollableHeight] = useState(0);

  // Memoize itemsToRender derivation (Unchanged)
  const itemsToRender = useMemo(() => {
    return props.data
      ? props.data.slice(
          0,
          Math.min(MAX_ITEMS_TO_DISPLAY, manualLayoutConfig.length)
        )
      : [];
  }, [props.data]);

  // Memoize hasData derivation (Unchanged)
  const hasData = useMemo(() => itemsToRender.length > 0, [itemsToRender]);

  // Effect to update window size and calculate initial/updated scrollable height
  useEffect(() => {
    const handleResize = () => {
      const currentWindowHeight = window.innerHeight;
      const currentScrollHeight = document.documentElement.scrollHeight;
      setWindowSize({ width: window.innerWidth, height: currentWindowHeight });
      // Calculate scrollable distance
      setScrollableHeight(
        Math.max(0, currentScrollHeight - currentWindowHeight)
      );
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);

    // Optional: Recalculate scrollable height if content changes dynamically
    // using a MutationObserver or similar mechanism, if needed.

    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  // Effect to listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Update scrollY state based on window scroll position
      setScrollY(window.scrollY);

      // OPTIONAL: Recalculate scrollable height on scroll IF dynamic content loading can change it frequently.
      // Be mindful of performance implications. Usually, resize is sufficient.
      // const currentWindowHeight = window.innerHeight;
      // const currentScrollHeight = document.documentElement.scrollHeight;
      // setScrollableHeight(Math.max(0, currentScrollHeight - currentWindowHeight));
    };

    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty dependency array: runs once on mount, cleans up on unmount

  // Memoize normalized scroll position (0 at top, 1 at bottom)
  const normalizedScrollY = useMemo(() => {
    // Avoid division by zero if not scrollable
    return scrollableHeight > 0
      ? Math.min(1, Math.max(0, scrollY / scrollableHeight))
      : 0;
  }, [scrollY, scrollableHeight]);

  // Memoize centered normalized scroll position (-0.5 to 0.5)
  // This makes the center of the scroll range the "zero point" for parallax
  const centeredNormalizedScrollY = useMemo(
    () => normalizedScrollY - 0.5,
    [normalizedScrollY]
  );

  // --- Parallax Calculations based on Scroll ---

  // Memoize Logo Parallax Offset Calculation (Only Y-axis based on scroll)
  const logoTranslateX = 0; // No horizontal movement from scroll
  const logoTranslateY = useMemo(
    () =>
      -centeredNormalizedScrollY * BASE_PARALLAX_STRENGTH * LOGO_DEPTH_FACTOR,
    [centeredNormalizedScrollY] // Depends only on scroll
  );

  // --- Animation Variants (Adapted) ---

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

  // Memoize the logoVariants object creation (Uses updated translate values)
  const logoVariants = useMemo(
    () => ({
      hidden: { scale: 1, opacity: 0, x: 0, y: 0 },
      visible: {
        scale: 0.5, // Or adjust target scale for mobile
        opacity: 1,
        x: logoTranslateX, // Now 0
        y: logoTranslateY, // Now based on scroll
        transition: {
          scale: { duration: 0.8, ease: "easeInOut", delay: 1.6 },
          opacity: { duration: 0.8, ease: "easeInOut", delay: 0.4 },
          x: { ...springTransition }, // Spring transition for X (though target is 0)
          y: { ...springTransition }, // Spring transition for Y
        },
      },
    }),
    [logoTranslateY] // Only recreate if logoTranslateY changes
  );

  // Memoize the expensive item configuration mapping (Adapted for scroll)
  const itemConfigs = useMemo(() => {
    return itemsToRender.map((item, index) => {
      const layout = manualLayoutConfig[index];
      const { top, left, depthFactor } = layout;

      // Calculate live target translation based on memoized scroll value
      // Only applying parallax on Y-axis for simplicity with scroll
      const liveTargetTranslateX = 0;
      const liveTargetTranslateY =
        -centeredNormalizedScrollY * BASE_PARALLAX_STRENGTH * depthFactor;

      const itemKey =
        item && typeof item === "object" && "id" in item && item.id
          ? item.id
          : `item-${index}`;

      const randomSeed = index + 1;
      const initialScale = seededRandomRange(randomSeed * 1.1, 1.0, 1.3); // Slightly adjust scale range maybe
      const staggerDelay = 1.7 + seededRandomRange(randomSeed * 1.2, 0, 0.5);

      const itemInitialState = {
        x: 0,
        y: 0,
        scale: initialScale,
        opacity: 0,
      };
      const itemAnimateState = {
        x: liveTargetTranslateX, // Target X is 0
        y: liveTargetTranslateY, // Target Y based on scroll
        scale: 1,
        opacity: 1,
      };
      const itemTransitionConfig = {
        x: { ...springTransition },
        y: { ...springTransition }, // Spring for smooth scroll reaction
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
      };
    });
    // Dependencies: itemsToRender triggers full remap,
    // centeredNormalizedScrollY triggers update of target translations
  }, [itemsToRender, centeredNormalizedScrollY]);

  // --- Render Logic ---
  // Simplified render structure - removed Outer/Inner crossfade for hover.
  // You could re-introduce similar logic based on touch events if needed.
  return (
    <HomeCanvasWrapper
      variants={canvasVariants}
      initial="hidden"
      animate="visible"
      onAnimationComplete={() => setAnimationComplete(true)}
      $animationComplete={animationComplete}
    >
      {/* Render the Logo Background Layer */}
      <Inner>
        <LogoWrapper variants={logoVariants} initial="hidden" animate="visible">
          <MemoizedLogoInner>
            {/* Decide which logo color variant to use or make it dynamic */}
            <LogoIcon colour={"var(--colour-foreground)"} />
          </MemoizedLogoInner>
        </LogoWrapper>
      </Inner>

      {/* Render Parallax Items */}
      {hasData &&
        itemConfigs.map((config) => (
          <ItemWrapper
            key={config.key}
            style={{ top: config.initialTop, left: config.initialLeft }}
            initial={config.itemInitial}
            animate={config.itemAnimate}
            transition={config.itemTransition}
          >
            {/* Ensure CanvasCard works without hover props or adapt it */}
            <CanvasCard
              description={config.description}
              link={config.link}
              media={config.media}
              project={config.project}
              title={config.title}
              useProjectReference={config.useProjectReference}
              // Removed isHovered/setIsHovered - Card needs to handle this absence
              // isHovered={false} // Or pass default values if required
              // setIsHovered={() => {}}
            />
          </ItemWrapper>
        ))}
    </HomeCanvasWrapper>
  );
}); // End React.memo wrapper

export default MobileHomeCanvas; // Export the new component name
