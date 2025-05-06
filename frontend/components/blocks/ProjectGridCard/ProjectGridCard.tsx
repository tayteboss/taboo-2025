import React, { useState, useCallback, useMemo } from "react"; // Import React hooks
import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import MediaStack from "../../common/MediaStack"; // Assumed memoized
import pxToRem from "../../../utils/pxToRem";
import Link from "next/link";
import HoverTyper from "../../elements/HoverTyper"; // Assumed memoized
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

// --- Styled Components ---

const ProjectGridCardWrapper = styled(motion.div)<{ $zoomLevel: number }>`
  // Grid span logic remains the same
  grid-column: span
    ${({ $zoomLevel }) => {
      if ($zoomLevel === 3) return 4;
      if ($zoomLevel === 2) return 3;
      if ($zoomLevel === 1) return 2;
      return 1;
    }};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    grid-column: 1 / -1;
  }

  // Hover effect on media moved here for clarity, but could stay on wrapper
  &:hover {
    .media-hover-effect {
      // Target a class instead of specific tags
      transform: scale(1.03);
    }
  }
`;

const ImageWrapper = styled.div<{ $ratio: string; $zoomLevel: number }>`
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  position: relative; // Needed if adding overlays inside
  margin-bottom: ${({ $zoomLevel }) => {
    if ($zoomLevel === 3) return pxToRem(16);
    if ($zoomLevel === 2) return pxToRem(12);
    if ($zoomLevel === 1) return pxToRem(10);
    return pxToRem(10);
  }};

  .media-wrapper {
    padding-top: ${(props) => props.$ratio};
  }

  // Class target for hover effect
  .media-hover-effect {
    transition: transform var(--transition-speed-slow) var(--transition-ease);
  }
`;

const ContentWrapper = styled.div<{ $zoomLevel: number }>`
  width: 100%;
  overflow: hidden; // Keep overflow hidden for safety

  // Removed hover logic for inner opacities - handled by component state now

  // Font size logic remains the same
  * {
    font-size: ${({ $zoomLevel }) => {
      if ($zoomLevel === 3) return pxToRem(18);
      if ($zoomLevel === 2) return pxToRem(16);
      if ($zoomLevel === 1) return pxToRem(12);
      return pxToRem(10);
    }};
    line-height: ${({ $zoomLevel }) => {
      if ($zoomLevel === 3) return pxToRem(22);
      if ($zoomLevel === 2) return pxToRem(18);
      if ($zoomLevel === 1) return pxToRem(13);
      return pxToRem(11);
    }};
    transition: font-size var(--transition-speed-default) var(--transition-ease);
  }
`;

// Set position relative to act as anchor for absolute children
const DesktopTitle = styled.h3`
  position: relative;
  display: flex; // Or block, depending on desired layout flow before hover
  align-items: center;
  color: var(--colour-foreground);
  white-space: nowrap;
  min-height: 1.2em;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: none;
  }
`;
// Set position relative to act as anchor for absolute children
const MobileTitle = styled.h3`
  display: none;
  color: var(--colour-foreground);
  white-space: pre;
  min-height: 1.2em;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: flex;
  }
`;

// Styled component for the absolutely positioned inner text elements
const AnimatedText = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  opacity: ${(props) => (props.$isActive ? 1 : 0)};
  transition: opacity var(--transition-speed-default) var(--transition-ease);
  // Prevent interaction when hidden
  pointer-events: ${(props) => (props.$isActive ? "auto" : "none")};
  // Potentially add will-change for smoother opacity transition
  will-change: opacity;
`;

const Subtitle = styled.h4`
  color: var(--colour-foreground);
  opacity: 0.5;
  transition: all var(--transition-speed-default) var(--transition-ease);
`;

// --- Prop Types ---
type Props = {
  title: ProjectType["title"];
  slug: ProjectType["slug"];
  client: ProjectType["client"];
  gridThumbnailMedia: ProjectType["gridThumbnailMedia"];
  gridThumbnailRatio: ProjectType["gridThumbnailRatio"];
  services: ProjectType["services"];
  industries: ProjectType["industries"];
  year: ProjectType["year"];
  zoomLevel: number;
  index: number;
};

// --- Component ---
const ProjectGridCard = React.memo((props: Props) => {
  const {
    title,
    slug,
    client,
    gridThumbnailMedia,
    gridThumbnailRatio,
    services,
    industries,
    year,
    zoomLevel,
    index,
  } = props;

  const [isHovered, setIsHovered] = useState(false);

  // Memoize derived string
  const serviceIndustryTitle = useMemo(
    () => `${services}, ${industries}`,
    [services, industries]
  );

  // Memoize mouse handlers
  const handleMouseOver = useCallback(() => setIsHovered(true), []);
  const handleMouseOut = useCallback(() => setIsHovered(false), []);

  // Intersection observer setup (unchanged, assuming needed)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  const currentSlug = slug?.current; // Get slug value once

  if (!currentSlug) {
    // Handle missing slug gracefully, maybe return null or a placeholder
    return null;
  }

  return (
    <ProjectGridCardWrapper
      ref={ref} // Attach ref here for intersection observer
      $zoomLevel={zoomLevel}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key={currentSlug}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      layout
    >
      <Link
        href={`/work/${currentSlug}`}
        passHref
        legacyBehavior
        aria-label="Open Case Study"
      >
        <a style={{ textDecoration: "none" }}>
          {" "}
          <ImageWrapper
            $ratio={gridThumbnailRatio || "100%"}
            $zoomLevel={zoomLevel}
            className={`view-element-difference ${
              inView ? "view-element-difference--in-view" : ""
            }`}
          >
            {gridThumbnailMedia && (
              <div className="media-hover-effect">
                <MediaStack
                  data={gridThumbnailMedia}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  isPriority={index < 4}
                  lazyLoad={index > 4}
                />
              </div>
            )}
          </ImageWrapper>
          <ContentWrapper $zoomLevel={zoomLevel}>
            <DesktopTitle className="color-switch">
              {/* Client Title - Active when NOT hovered */}
              <AnimatedText $isActive={!isHovered}>
                <HoverTyper data={client?.title || ""} inView={!isHovered} />
              </AnimatedText>
              {/* Project Title - Active WHEN hovered */}
              <AnimatedText $isActive={isHovered}>
                <HoverTyper data={title || ""} inView={isHovered} />
              </AnimatedText>
            </DesktopTitle>
            <MobileTitle>
              {client?.title || ""} — <span>{title || ""}</span>
            </MobileTitle>
            <Subtitle className="color-switch">
              {serviceIndustryTitle || ""}
            </Subtitle>
            <Subtitle className="color-switch">{year || ""}</Subtitle>
          </ContentWrapper>
        </a>
      </Link>
    </ProjectGridCardWrapper>
  );
});

ProjectGridCard.displayName = "ProjectGridCard"; // Add display name for DevTools

export default ProjectGridCard;
