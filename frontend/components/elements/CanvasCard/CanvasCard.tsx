import React, { useCallback, useMemo, useState } from "react"; // Import React, useCallback, useMemo, useState
import styled from "styled-components";
import { MediaType, ProjectType } from "../../../shared/types/types";
import MediaStack from "../../common/MediaStack"; // Assume MediaStack is memoized if appropriate
import pxToRem from "../../../utils/pxToRem";
import HoverTyper from "../HoverTyper"; // Assume HoverTyper is memoized if appropriate
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";

// Styled Components (Unchanged - CSS :hover is generally efficient)
const CanvasCardWrapper = styled.div<{ $isHovered: boolean; $isLink: boolean }>`
  pointer-events: all;
  opacity: ${(props) => (props.$isHovered ? 0.4 : 1)};
  transform: ${(props) => (props.$isHovered ? "scale(0.98)" : "scale(1)")};
  cursor: ${(props) => props.$isLink && "pointer"};

  &:hover {
    opacity: 1 !important;
    transform: scale(1.08) !important;

    .content-wrapper {
      opacity: 1 !important;
    }
  }

  transition:
    opacity var(--transition-speed-slow) var(--transition-ease),
    transform var(--transition-speed-slow) var(--transition-ease);
`;

const MediaWrapper = styled.div``;

const MediaInner = styled.div<{ $ratio: string }>`
  width: 230px;
  overflow: hidden;
  border-radius: 10px;

  .media-wrapper {
    padding-top: ${(props) => props.$ratio};
  }
`;

const ContentWrapper = styled.div`
  padding-top: ${pxToRem(8)};
  opacity: 0;
  transition: all var(--transition-speed-default) var(--transition-ease);
`;

const Title = styled.div`
  color: var(--colour-foreground);
`;

const Subtitle = styled.div`
  color: var(--colour-foreground);
  opacity: 0.5;
`;

type Props = {
  description?: string;
  link?: string;
  media?: MediaType;
  project?: ProjectType;
  title?: ProjectType["title"];
  useProjectReference: boolean;
  isHovered: boolean; // Prop from parent indicating if *any* card is hovered
  setIsHovered: React.Dispatch<React.SetStateAction<boolean>>; // Assumed stable via useCallback in parent
};

// Wrap component in React.memo
const CanvasCard = React.memo(
  ({
    description,
    link,
    media,
    project,
    title,
    useProjectReference,
    isHovered, // Received from parent
    setIsHovered,
  }: Props) => {
    // State for effects specific to *this* card's hover
    const [isInternalHover, setIsInternalHover] = useState(false);
    const router = useRouter();

    // Memoize derived data instead of using useEffect/useState
    const mediaData = useMemo(() => {
      return useProjectReference ? project?.gridThumbnailMedia : media;
    }, [useProjectReference, project, media]);

    const ratio = useMemo(() => {
      return useProjectReference
        ? project?.gridThumbnailRatio || "100%"
        : "100%";
    }, [useProjectReference, project]);

    const isLink = useMemo(
      () => !!link || useProjectReference,
      [link, useProjectReference]
    );

    // Memoize the click handler
    const handleLinkClick = useCallback(() => {
      if (useProjectReference) {
        // Ensure project?.slug exists before pushing
        if (project?.slug) {
          router.push(`/work/${project.slug}`);
        }
      } else {
        if (link) {
          window.open(link, "_blank");
        }
      }
    }, [useProjectReference, project, link, router]);

    // Memoize mouse handlers to ensure stable references if needed,
    // though primary benefit here is updating state
    const handleMouseOver = useCallback(() => {
      setIsHovered(true); // Update parent state
      setIsInternalHover(true); // Update local state
    }, [setIsHovered]);

    const handleMouseOut = useCallback(() => {
      setIsHovered(false); // Update parent state
      setIsInternalHover(false); // Update local state
    }, [setIsHovered]);

    const { ref, inView } = useInView({
      triggerOnce: false,
      threshold: 0.01,
      rootMargin: "-50px",
    });

    return (
      // Pass parent's isHovered state for the "fade others" effect
      // Pass local isLink derived state
      <CanvasCardWrapper
        $isLink={isLink}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={isLink ? handleLinkClick : undefined} // Only attach onClick if it's a link
        $isHovered={isHovered && !isInternalHover} // Apply fade only if parent is hovered BUT this card isn't the one being hovered
      >
        <MediaWrapper ref={ref}>
          <MediaInner
            $ratio={ratio}
            className={`view-element-difference ${
              inView ? "view-element-difference--in-view" : ""
            }`}
          >
            {/* Ensure MediaStack handles potentially undefined data gracefully */}
            {mediaData && <MediaStack data={mediaData} noAnimation />}
          </MediaInner>
          {/* Use isInternalHover to control visibility/animation of content */}
          <ContentWrapper
            className="content-wrapper"
            style={{ opacity: isInternalHover ? 1 : 0 }} // Control directly via local hover state
          >
            {useProjectReference ? (
              <>
                <Title className="type-mono-small">
                  <HoverTyper
                    data={`${project?.client?.title || ""}, ${
                      project?.title || ""
                    }`}
                    inView={isInternalHover} // Controlled by local hover
                  />
                </Title>
                <Subtitle className="type-mono-small">
                  {project?.service}
                </Subtitle>
                <Subtitle className="type-mono-small">{project?.year}</Subtitle>
              </>
            ) : (
              <>
                <Title className="type-mono-small">
                  {/* Pass title directly if HoverTyper isn't essential or memoize HoverTyper */}
                  <HoverTyper data={title || ""} inView={isInternalHover} />
                </Title>
                <Subtitle className="type-mono-small">
                  {description || ""}
                </Subtitle>
              </>
            )}
          </ContentWrapper>
        </MediaWrapper>
      </CanvasCardWrapper>
    );
  }
);

// Set display name for better debugging
CanvasCard.displayName = "CanvasCard";

export default CanvasCard;
