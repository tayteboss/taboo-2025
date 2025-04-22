import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import MediaStack from "../../common/MediaStack";
import pxToRem from "../../../utils/pxToRem";
import Link from "next/link";
import HoverTyper from "../../elements/HoverTyper";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import { motion } from "framer-motion";

const ProjectGridCardWrapper = styled(motion.div)<{ $zoomLevel: number }>`
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

  &:hover {
    img,
    mux-player {
      transform: scale(1.03);
    }
  }

  img,
  mux-player {
    transition: all var(--transition-speed-slow) var(--transition-ease);
  }
`;

const ImageWrapper = styled.div<{ $ratio: string; $zoomLevel: number }>`
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: ${({ $zoomLevel }) => {
    if ($zoomLevel === 3) return pxToRem(16);
    if ($zoomLevel === 2) return pxToRem(12);
    if ($zoomLevel === 1) return pxToRem(10);
    return pxToRem(10);
  }};

  .media-wrapper {
    padding-top: ${(props) => props.$ratio};
  }
`;

const ContentWrapper = styled.div<{ $zoomLevel: number }>`
  width: 100%;
  overflow: hidden;

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

const Title = styled.h3`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;
  color: var(--colour-foreground);
  white-space: nowrap;
  position: relative;

  transition: all var(--transition-speed-default) var(--transition-ease);
`;

const TitleSpan = styled.span<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;
  color: var(--colour-foreground);
  opacity: ${(props) => (props.$isActive ? "0.5" : "0")};

  transition: all var(--transition-speed-default) var(--transition-ease);

  * {
    flex-wrap: nowrap;
  }

  &:after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 100%;
    background: linear-gradient(
      90deg,
      var(--colour-background-alpha-0) 0%,
      var(--colour-background) 100%
    );
  }
`;

const Subtitle = styled.h4`
  color: var(--colour-foreground);
  opacity: 0.5;

  transition: all var(--transition-speed-default) var(--transition-ease);
`;

type Props = {
  title: ProjectType["title"];
  slug: ProjectType["slug"];
  client: ProjectType["client"];
  gridThumbnailMedia: ProjectType["gridThumbnailMedia"];
  gridThumbnailRatio: ProjectType["gridThumbnailRatio"];
  service: ProjectType["service"];
  industry: ProjectType["industry"];
  year: ProjectType["year"];
  zoomLevel: number;
};

const ProjectGridCard = (props: Props) => {
  const {
    title,
    slug,
    client,
    gridThumbnailMedia,
    gridThumbnailRatio,
    service,
    industry,
    year,
    zoomLevel,
  } = props;

  const [isHovered, setIsHovered] = useState(false);

  const serviceIndustryTitle = `${service}, ${industry}`;

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  return (
    <ProjectGridCardWrapper
      ref={ref}
      $zoomLevel={zoomLevel}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key={slug?.current}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      layout
    >
      <Link href={`/work/${slug?.current}`}>
        <ImageWrapper
          $ratio={gridThumbnailRatio || "100%"}
          $zoomLevel={zoomLevel}
          className={`view-element-difference ${
            inView ? "view-element-difference--in-view" : ""
          }`}
        >
          <MediaStack data={gridThumbnailMedia} />
        </ImageWrapper>
        <ContentWrapper $zoomLevel={zoomLevel}>
          <Title className="color-switch">
            <HoverTyper data={title || ""} inView={isHovered} />
            <HoverTyper data={client?.title || ""} inView={!isHovered} />
          </Title>
          <Subtitle className="color-switch">
            {serviceIndustryTitle || ""}
          </Subtitle>
          <Subtitle className="color-switch">{year || ""}</Subtitle>
        </ContentWrapper>
      </Link>
    </ProjectGridCardWrapper>
  );
};

export default ProjectGridCard;
