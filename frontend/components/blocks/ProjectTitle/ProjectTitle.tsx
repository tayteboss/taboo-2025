import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import LayoutWrapper from "../../layout/LayoutWrapper";
import pxToRem from "../../../utils/pxToRem";
import LayoutGrid from "../../layout/LayoutGrid";
import MediaStack from "../../common/MediaStack";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { useRouter } from "next/router";
import useViewportWidth from "../../../hooks/useViewportWidth";
import { useEffect, useRef, useState } from "react";

const ProjectTitleWrapper = styled.section`
  padding-top: ${pxToRem(200)};
  margin-bottom: ${pxToRem(20)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    margin-bottom: ${pxToRem(10)};
  }
`;

const TitleWrapper = styled.div`
  margin-bottom: ${pxToRem(100)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    margin-bottom: ${pxToRem(50)};
  }
`;

const Client = styled.h1`
  color: var(--colour-foreground);
`;

const Title = styled.h2`
  color: var(--colour-foreground);
  opacity: 0.5;
`;

const DetailsWrapper = styled.div`
  margin-bottom: ${pxToRem(20)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    margin-bottom: ${pxToRem(10)};
  }
`;

const ClientDetail = styled.div`
  display: flex;
  gap: ${pxToRem(8)};
  grid-column: span 2;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: none;
  }
`;

const ServicesDetail = styled.div`
  display: flex;
  gap: ${pxToRem(8)};
  grid-column: span 4;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    grid-column: span 2;
    gap: ${pxToRem(4)};
  }
`;

const YearDetail = styled.div`
  display: flex;
  gap: ${pxToRem(8)};
  grid-column: span 5;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    grid-column: span 1;
    gap: ${pxToRem(4)};

    * {
      white-space: nowrap;
    }
  }
`;

const ProjectDetail = styled.div`
  grid-column: span 1;
  text-align: right;
  display: flex;
  justify-content: flex-end;
`;

const DetailTitle = styled.span`
  white-space: nowrap;
  color: var(--colour-foreground);
  opacity: 0.5;
`;

const DetailText = styled.span`
  white-space: nowrap;
  color: var(--colour-foreground);
`;

const MediaWrapper = styled(motion.div)`
  width: calc(100% - 40px);
  margin: 0 auto;
  overflow: hidden;
  border-radius: 15px;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    width: calc(100% - 20px);
    border-radius: 10px;
  }

  .media-wrapper {
    padding-top: 56.25%;
  }
`;

type Props = {
  client: ProjectType["client"]["title"];
  title: ProjectType["title"];
  services: ProjectType["services"];
  year: ProjectType["year"];
  heroMedia: ProjectType["heroMedia"];
};

const ProjectTitle = (props: Props) => {
  const { client, title, services, year, heroMedia } = props;

  const [windowHeight, setWindowHeight] = useState(0);
  const [distanceToTop, setDistanceToTop] = useState(0);

  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const router = useRouter();
  const viewport = useViewportWidth();

  const isMobile = viewport === "tablet-portrait" || viewport === "mobile";

  console.log("distanceToTop", distanceToTop);

  const offset = useTransform(
    scrollY,
    [0, windowHeight - distanceToTop],
    [isMobile ? 20 : 40, isMobile ? 20 : 0]
  );

  const borderRadius = useTransform(
    scrollY,
    [0, windowHeight - distanceToTop],
    [isMobile ? "10px" : "15px", isMobile ? "10px" : "0px"]
  );

  const width = useMotionTemplate`calc(100% - ${offset}px)`;

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);

      if (ref?.current) {
        setDistanceToTop(
          window.pageYOffset + ref.current.getBoundingClientRect().top
        );
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [router]);

  return (
    <ProjectTitleWrapper>
      <LayoutWrapper>
        <TitleWrapper>
          <Client className="color-switch">{client || ""}</Client>
          <Title className="color-switch type-h1">{title || ""}</Title>
        </TitleWrapper>
        <DetailsWrapper>
          <LayoutGrid>
            <ClientDetail>
              <DetailTitle className="type-mono-small">Client</DetailTitle>
              <DetailText className="type-mono-small">
                {client || ""}
              </DetailText>
            </ClientDetail>
            <ServicesDetail>
              <DetailTitle className="type-mono-small">Services</DetailTitle>
              <DetailText className="type-mono-small">
                {services || ""}
              </DetailText>
            </ServicesDetail>
            <YearDetail>
              <DetailTitle className="type-mono-small">Year</DetailTitle>
              <DetailText className="type-mono-small">{year || ""}</DetailText>
            </YearDetail>
            <ProjectDetail>
              <DetailText className="type-mono-small">(P-TBC)</DetailText>
            </ProjectDetail>
          </LayoutGrid>
        </DetailsWrapper>
      </LayoutWrapper>
      {/* Apply the motion template value to the style */}
      <MediaWrapper style={{ width, borderRadius }} ref={ref}>
        {heroMedia && <MediaStack data={heroMedia} />}
      </MediaWrapper>
    </ProjectTitleWrapper>
  );
};

export default ProjectTitle;
