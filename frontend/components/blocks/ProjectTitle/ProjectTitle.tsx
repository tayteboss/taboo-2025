import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import LayoutWrapper from "../../layout/LayoutWrapper";
import pxToRem from "../../../utils/pxToRem";
import LayoutGrid from "../../layout/LayoutGrid";
import MediaStack from "../../common/MediaStack";
import HoverTyper from "../../elements/HoverTyper";
import { useInView } from "react-intersection-observer";

const ProjectTitleWrapper = styled.section`
  padding-top: ${pxToRem(200)};
  margin-bottom: ${pxToRem(20)};
  position: relative;
  z-index: 10;

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

const Title = styled.div`
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
  text-transform: capitalize;
`;

const MediaWrapper = styled.div`
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
  heroMedia: ProjectType["heroMedia"];
  projectNumber: number;
};

const ProjectTitle = (props: Props) => {
  const { client, title, services, heroMedia, projectNumber } = props;

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  return (
    <ProjectTitleWrapper className="project-title" ref={ref}>
      <LayoutWrapper>
        <TitleWrapper>
          <Client className="color-switch">{client || ""}</Client>
          <Title className="color-switch type-h1">
            <HoverTyper data={title} inView={inView} noHoverAnimation={true} />
          </Title>
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
                {services?.length
                  ? services.map((service) => service).join(", ")
                  : ""}
              </DetailText>
            </ServicesDetail>
            <YearDetail></YearDetail>
            <ProjectDetail>
              <DetailText className="type-mono-small">
                (P-{projectNumber})
              </DetailText>
            </ProjectDetail>
          </LayoutGrid>
        </DetailsWrapper>
      </LayoutWrapper>
      <MediaWrapper
        className={`view-element-difference ${
          inView ? "view-element-difference--in-view" : ""
        }`}
      >
        {heroMedia && (
          <MediaStack
            data={heroMedia}
            useLoader
            sizes="100vw"
            useVideoControls={true}
          />
        )}
      </MediaWrapper>
    </ProjectTitleWrapper>
  );
};

export default ProjectTitle;
