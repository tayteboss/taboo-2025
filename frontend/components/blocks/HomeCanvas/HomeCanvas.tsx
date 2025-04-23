import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
// Adjust import paths as needed
import { HomePageType } from "../../../shared/types/types";
import { useMousePosition } from "../../../hooks/useMousePosition";
import CanvasCard from "../../elements/CanvasCard"; // Assume CanvasCard is memoized: export default React.memo(CanvasCard);
import LogoIcon from "../../svgs/LogoIcon";

// Styled Components (Unchanged)
const HomeCanvasWrapper = styled(motion.div)<{ $animationComplete: boolean }>`
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

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: none;
  }

  * {
    pointer-events: ${(props) =>
      props.$animationComplete ? "all" : "none"} !important;
  }
`;

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
  pointer-events: none;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: none;
  }
`;

const Inner = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  mix-blend-mode: normal;
  pointer-events: none;
`;

const LogoWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  mix-blend-mode: soft-light;
`;

// Memoize LogoInner to prevent re-render if props (colour) don't change
const MemoizedLogoInner = React.memo(styled.div`
  svg {
    width: 98vw;
    height: auto;
  }
`);

const ItemWrapper = styled(motion.div)`
  position: absolute;
  will-change: transform;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

// Configuration (Unchanged)
const MAX_ITEMS_TO_DISPLAY = 20;
const BASE_PARALLAX_STRENGTH = 1400;
const LOGO_DEPTH_FACTOR = 0.1;

const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 30,
  mass: 1,
};

const manualLayoutConfig = [
  { top: "-50%", left: "25%", depthFactor: 0.8 },
  { top: "120%", left: "75%", depthFactor: 0.9 },
  { top: "75%", left: "-30%", depthFactor: 0.7 },
  { top: "70%", left: "95%", depthFactor: 1.0 },
  { top: "-30%", left: "125%", depthFactor: 0.85 },
  { top: "-25%", left: "-30%", depthFactor: 0.75 },
  { top: "60%", left: "128%", depthFactor: 0.95 },
  { top: "5%", left: "5%", depthFactor: 0.9 },
  { top: "125%", left: "35%", depthFactor: 0.8 },
  { top: "20%", left: "-20%", depthFactor: 0.7 },
  { top: "45%", left: "70%", depthFactor: 0.85 },
  { top: "15%", left: "120%", depthFactor: 0.95 },
  { top: "75%", left: "55%", depthFactor: 0.8 },
  { top: "125%", left: "120%", depthFactor: 0.9 },
  { top: "-15%", left: "35%", depthFactor: 0.7 },
  { top: "60%", left: "-10%", depthFactor: 0.75 },
  { top: "25%", left: "40%", depthFactor: 0.95 },
  { top: "120%", left: "-25%", depthFactor: 0.8 },
  { top: "55%", left: "30%", depthFactor: 0.85 },
  { top: "-20%", left: "75%", depthFactor: 0.9 },
  { top: "90%", left: "-15%", depthFactor: 0.7 },
];

// Helper Function (Unchanged)
const seededRandomRange = (seed: number, min: number, max: number): number => {
  const random = Math.sin(seed) * 10000;
  const normalized = random - Math.floor(random);
  return min + normalized * (max - min);
};

type Props = { data: HomePageType["items"] };

// Apply React.memo to the component itself if its props don't change often
const HomeCanvas = React.memo((props: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Memoize itemsToRender derivation
  const itemsToRender = useMemo(() => {
    return props.data
      ? props.data.slice(
          0,
          Math.min(MAX_ITEMS_TO_DISPLAY, manualLayoutConfig.length)
        )
      : [];
  }, [props.data]);

  // Memoize hasData derivation
  const hasData = useMemo(() => itemsToRender.length > 0, [itemsToRender]);

  const position = useMousePosition();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Memoize normalized mouse position calculation
  const liveNormalizedX = useMemo(
    () =>
      position.x !== null && windowSize.width > 0
        ? position.x / windowSize.width - 0.5
        : 0,
    [position.x, windowSize.width]
  );

  const liveNormalizedY = useMemo(
    () =>
      position.y !== null && windowSize.height > 0
        ? position.y / windowSize.height - 0.5
        : 0,
    [position.y, windowSize.height]
  );

  // Memoize Logo Parallax Offset Calculation
  const logoTranslateX = useMemo(
    () => -liveNormalizedX * BASE_PARALLAX_STRENGTH * LOGO_DEPTH_FACTOR,
    [liveNormalizedX]
  );
  const logoTranslateY = useMemo(
    () => -liveNormalizedY * BASE_PARALLAX_STRENGTH * LOGO_DEPTH_FACTOR,
    [liveNormalizedY]
  );

  // Animation Variants (Static definitions - no dependencies)
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

  // Memoize the logoVariants object creation
  const logoVariants = useMemo(
    () => ({
      hidden: { scale: 1, opacity: 0, x: 0, y: 0 },
      visible: {
        scale: 0.5,
        opacity: 1,
        x: logoTranslateX, // Use memoized value
        y: logoTranslateY, // Use memoized value
        transition: {
          scale: { duration: 0.8, ease: "easeInOut", delay: 1.6 },
          opacity: { duration: 0.8, ease: "easeInOut", delay: 0.4 },
          x: { ...springTransition },
          y: { ...springTransition },
        },
      },
    }),
    [logoTranslateX, logoTranslateY] // Only recreate if parallax values change
  );

  const logoCrossfadeTransition = useMemo(
    () => ({
      opacity: { duration: 0.01, ease: "easeInOut" },
      scale: { duration: 0.5, ease: "easeInOut" },
    }),
    []
  );

  // Memoize the expensive item configuration mapping
  const itemConfigs = useMemo(() => {
    return itemsToRender.map((item, index) => {
      const layout = manualLayoutConfig[index];
      const { top, left, depthFactor } = layout;
      // Calculate live target translation based on memoized normalized values
      const liveTargetTranslateX =
        -liveNormalizedX * BASE_PARALLAX_STRENGTH * depthFactor;
      const liveTargetTranslateY =
        -liveNormalizedY * BASE_PARALLAX_STRENGTH * depthFactor;
      const itemKey =
        item && typeof item === "object" && "id" in item && item.id
          ? item.id
          : `item-${index}`;

      const randomSeed = index + 1;
      const initialScale = seededRandomRange(randomSeed * 1.1, 1.2, 1.6);
      const staggerDelay = 1.7 + seededRandomRange(randomSeed * 1.2, 0, 0.5);

      const itemInitialState = {
        x: 0,
        y: 0,
        scale: initialScale,
        opacity: 0,
      };
      const itemAnimateState = {
        x: liveTargetTranslateX,
        y: liveTargetTranslateY,
        scale: 1,
        opacity: 1,
      };
      const itemTransitionConfig = {
        x: { ...springTransition },
        y: { ...springTransition },
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
  }, [itemsToRender, liveNormalizedX, liveNormalizedY]); // Dependencies that trigger recalculation

  return (
    <>
      <Outer
        animate={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 0.95 : 1 }}
        transition={logoCrossfadeTransition}
      >
        <LogoWrapper variants={logoVariants} initial="hidden" animate="visible">
          <MemoizedLogoInner>
            <LogoIcon />
          </MemoizedLogoInner>
        </LogoWrapper>
      </Outer>

      <HomeCanvasWrapper
        variants={canvasVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={() => setAnimationComplete(true)}
        $animationComplete={animationComplete}
      >
        <Inner
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 0.95 : 1 }}
          transition={logoCrossfadeTransition}
        >
          <LogoWrapper
            variants={logoVariants}
            initial="hidden"
            animate="visible"
          >
            <MemoizedLogoInner>
              <LogoIcon colour={"var(--colour-foreground)"} />
            </MemoizedLogoInner>
          </LogoWrapper>
        </Inner>

        {hasData &&
          itemConfigs.map((config) => (
            <ItemWrapper
              key={config.key}
              style={{ top: config.initialTop, left: config.initialLeft }}
              initial={config.itemInitial}
              animate={config.itemAnimate}
              transition={config.itemTransition}
            >
              {/* Ensure CanvasCard is memoized */}
              <CanvasCard
                description={config.description}
                link={config.link}
                media={config.media}
                project={config.project}
                title={config.title}
                useProjectReference={config.useProjectReference}
                isHovered={isHovered}
                setIsHovered={setIsHovered}
              />
            </ItemWrapper>
          ))}
      </HomeCanvasWrapper>
    </>
  );
}); // End React.memo wrapper

export default HomeCanvas;
