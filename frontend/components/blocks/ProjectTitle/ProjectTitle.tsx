import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import LayoutWrapper from "../../layout/LayoutWrapper";
import pxToRem from "../../../utils/pxToRem";
import LayoutGrid from "../../layout/LayoutGrid";
import MediaStack from "../../common/MediaStack";
// import { useWindowHeight } from "../../../hooks/useWindowHeight"; // Consider using this if it exists and works
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion"; // Import useMotionTemplate
import { useRouter } from "next/router";
import useViewportWidth from "../../../hooks/useViewportWidth";
import { useEffect, useState } from "react";

// ... (Keep your styled components as they are) ...
const ProjectTitleWrapper = styled.section`
  padding-top: ${pxToRem(200)};
  margin-bottom: ${pxToRem(20)};
`;

const TitleWrapper = styled.div`
  margin-bottom: ${pxToRem(100)};
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
`;

const ClientDetail = styled.div`
  display: flex;
  gap: ${pxToRem(8)};
  grid-column: span 2;
`;

const ServicesDetail = styled.div`
  display: flex;
  gap: ${pxToRem(8)};
  grid-column: span 4;
`;

const YearDetail = styled.div`
  display: flex;
  gap: ${pxToRem(8)};
  grid-column: span 5;
`;

const ProjectDetail = styled.div`
  grid-column: span 1;
  text-align: right;
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
  /* Default width is set here */
  width: calc(100% - 40px);
  margin: 0 auto;
  overflow: hidden;
  border-radius: 15px;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    /* Default width for smaller screens */
    width: calc(100% - 20px);
  }

  .media-wrapper {
    padding-top: 56.25%; /* Example aspect ratio */
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

  const { scrollY } = useScroll();
  const router = useRouter(); // Keep if needed for other logic
  const viewport = useViewportWidth();

  const isMobile = viewport === "tablet-portrait" || viewport === "mobile";

  // 1. Transform the *numeric* offset value
  const offset = useTransform(
    scrollY,
    [0, windowHeight], // Input range (scroll position)
    [isMobile ? 20 : 40, 0] // Output range (pixel offset) -> Animate from 20/40 down to 0
  );

  // 1. Transform the *numeric* offset value
  const borderRadius = useTransform(
    scrollY,
    [0, windowHeight], // Input range (scroll position)
    ["15px", "0px"] // Output range (pixel offset) -> Animate from 20/40 down to 0
  );

  // 2. Use useMotionTemplate to create the dynamic width string
  const width = useMotionTemplate`calc(100% - ${offset}px)`;

  useEffect(() => {
    const handleResize = () => {
      // Ensure you are setting the height correctly on initial load and resize
      setWindowHeight(window.innerHeight);
    };

    handleResize(); // Call immediately to set initial height
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // <-- Changed dependency array to []
  // This effect now runs only once on mount to set initial height and add listener.
  // The resize listener updates the state, causing re-renders which recalculate transforms.
  // If you *really* need it to re-run on route change, add `router.pathname` or similar.

  // If you have a working useWindowHeight hook, prefer using it:
  // const windowHeight = useWindowHeight();
  // Then you can remove the useState and useEffect for windowHeight here.

  return (
    <ProjectTitleWrapper>
      <LayoutWrapper>
        {/* ... Title and Details ... */}
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
              <DetailText className="type-mono-small">Harcoded atm</DetailText>
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
      <MediaWrapper style={{ width, borderRadius }}>
        {heroMedia && <MediaStack data={heroMedia} />}
      </MediaWrapper>
    </ProjectTitleWrapper>
  );
};

export default ProjectTitle;
