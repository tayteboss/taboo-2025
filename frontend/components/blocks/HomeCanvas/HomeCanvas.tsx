import React, { useState, useEffect, useMemo } from "react";
import styled, { useTheme } from "styled-components";
import { motion } from "framer-motion";
import { HomePageType } from "../../../shared/types/types";
import { useMousePosition } from "../../../hooks/useMousePosition";
import CanvasCard from "../../elements/CanvasCard";
import LogoIcon from "../../svgs/LogoIcon";
import OverviewModal from "../OverviewModal";

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
  pointer-events: all;
`;

const MemoizedLogoInner = React.memo(styled.div`
  transition: all var(--transition-speed-default) var(--transition-ease);
  cursor: pointer;

  &:hover {
    transform: scale(1.03);
  }

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
const LOGO_PARALLAX_STRENGTH = 2000;
const LOGO_DEPTH_FACTOR = 0.3;

const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 30,
  mass: 1,
};

const manualLayoutConfig = [
  // 0
  { top: "-50%", left: "25%", depthFactor: 0.8 },
  // 1
  { top: "120%", left: "75%", depthFactor: 0.9 },
  // 2
  { top: "75%", left: "-30%", depthFactor: 0.7 },
  // 3
  { top: "70%", left: "95%", depthFactor: 1.0 },
  // 4
  { top: "-30%", left: "110%", depthFactor: 0.85 },
  // 5
  { top: "-25%", left: "-30%", depthFactor: 0.75 },
  // 6
  { top: "60%", left: "120%", depthFactor: 0.95 },
  // 7
  { top: "5%", left: "5%", depthFactor: 0.9 },
  // 8
  { top: "115%", left: "35%", depthFactor: 0.8 },
  // 9
  { top: "20%", left: "-20%", depthFactor: 0.7 },
  // 10
  { top: "35%", left: "75%", depthFactor: 0.85 },
  // 11
  { top: "15%", left: "115%", depthFactor: 0.95 },
  // 12
  { top: "75%", left: "55%", depthFactor: 0.8 },
  // 13
  { top: "115%", left: "112%", depthFactor: 0.9 },
  // 14
  { top: "-15%", left: "35%", depthFactor: 0.7 },
  // 15
  { top: "60%", left: "-10%", depthFactor: 0.75 },
  // 16
  { top: "15%", left: "40%", depthFactor: 0.95 },
  // 17
  { top: "110%", left: "0%", depthFactor: 0.8 },
  // 18
  { top: "65%", left: "25%", depthFactor: 0.85 },
  // 19
  { top: "-20%", left: "75%", depthFactor: 0.9 },
  // 20
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
  const [overviewModal, setOverviewModal] = useState<false | number>(false);
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
    () => -liveNormalizedX * LOGO_PARALLAX_STRENGTH * LOGO_DEPTH_FACTOR,
    [liveNormalizedX]
  );
  const logoTranslateY = useMemo(
    () => -liveNormalizedY * LOGO_PARALLAX_STRENGTH * LOGO_DEPTH_FACTOR,
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

  const theme = useTheme(); // <-- Access the theme object here
  const [isDarkMode, setIsDarkMode] = useState(false); // Consider initializing based on default theme or user preference

  const handleLightSwitch = () => {
    // Use a functional update for setting state based on previous state
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      // Use the newMode directly for setting properties
      document.documentElement.style.setProperty(
        "--colour-background",
        newMode ? theme.colours.black : theme.colours.white
      );
      document.documentElement.style.setProperty(
        "--colour-background-alpha-80",
        newMode ? theme.colours.blackAlpha80 : theme.colours.whiteAlpha80
      );
      document.documentElement.style.setProperty(
        "--colour-background-alpha-50",
        newMode ? theme.colours.blackAlpha50 : theme.colours.whiteAlpha50
      );
      document.documentElement.style.setProperty(
        "--colour-background-alpha-20",
        newMode ? theme.colours.blackAlpha20 : theme.colours.whiteAlpha20
      );
      document.documentElement.style.setProperty(
        "--colour-foreground",
        newMode ? theme.colours.white : theme.colours.black
      );
      document.documentElement.style.setProperty(
        "--colour-foreground-alpha-80",
        newMode ? theme.colours.whiteAlpha80 : theme.colours.blackAlpha80
      );
      document.documentElement.style.setProperty(
        "--colour-foreground-alpha-50",
        newMode ? theme.colours.whiteAlpha50 : theme.colours.blackAlpha50
      );
      document.documentElement.style.setProperty(
        "--colour-foreground-alpha-20",
        newMode ? theme.colours.whiteAlpha20 : theme.colours.blackAlpha20
      );
      // You might also want to set a class on the <html> or <body> element
      // document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  return (
    <>
      <Outer
        // animate={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 0.95 : 1 }}
        animate={{ scale: isHovered ? 0.95 : 1 }}
        transition={logoCrossfadeTransition}
      >
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

      <HomeCanvasWrapper
        variants={canvasVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={() => setAnimationComplete(true)}
        $animationComplete={animationComplete}
      >
        {/* <Inner
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
        </Inner> */}

        {hasData &&
          itemConfigs.map((config, i) => (
            <ItemWrapper
              key={`item-${config.key}-${i}`}
              style={{ top: config.initialTop, left: config.initialLeft }}
              initial={config.itemInitial}
              animate={config.itemAnimate}
              transition={config.itemTransition}
            >
              <>{config.key}</>
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
      </HomeCanvasWrapper>
      <OverviewModal
        isActive={!!overviewModal}
        data={overviewModal ? props.data[overviewModal]?.project : false}
        setOverviewModal={setOverviewModal}
      />
    </>
  );
}); // End React.memo wrapper

export default HomeCanvas;
