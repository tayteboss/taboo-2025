import { motion } from "framer-motion";
import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import MediaStack from "../../common/MediaStack";
import LayoutGrid from "../../layout/LayoutGrid";
import LayoutWrapper from "../../layout/LayoutWrapper";
import { ProjectType } from "../../../shared/types/types";
import { useState } from "react";
import HoverTyper from "../../elements/HoverTyper";
import { useRouter } from "next/navigation";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";

const NextProjectWrapper = styled.section`
  padding-top: ${pxToRem(200)};
  margin-bottom: ${pxToRem(20)};
  cursor: pointer;
  background: var(--colour-background);
  position: absolute;
  height: 100vh;
  overflow: hidden;
  border-radius: ${pxToRem(15)};
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 5;

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

const Title = styled(motion.h2)`
  color: var(--colour-foreground);
  opacity: 0.5;

  transition: {
    delay: 1;
  }
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

const MediaWrapper = styled(motion.div)<{ $animating: boolean }>`
  width: calc(100% - 40px);
  margin: 0 auto;
  overflow: hidden;
  border-radius: 15px;
  position: relative;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    width: calc(100% - 20px);
    border-radius: 10px;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${(props) =>
      props.$animating ? "var(--colour-white)" : "var(--colour-black)"};
    mix-blend-mode: difference;
    z-index: 2;

    transition: all 1000ms ease 300ms !important;
  }

  .media-wrapper {
    padding-top: 56.25%;
  }
`;

type Props = {
  data: ProjectType;
};

const NextProject = (props: Props) => {
  const { data } = props;

  const [triggerAnimation, setTriggerAnimation] = useState(false);
  const lenis = useLenis(({ scroll }) => {});

  const router = useRouter();

  if (!data?.slug?.current) {
    return null;
  }

  const nextWorkUrl = `/work/${data.slug.current}`;

  const handleClick = () => {
    setTriggerAnimation(true);

    if (!lenis) return;

    lenis?.scrollTo("bottom");

    setTimeout(() => {
      router.push(nextWorkUrl);
    }, 500);
  };

  return (
    <NextProjectWrapper
      className="cursor-next-project"
      onClick={() => {
        handleClick();
      }}
    >
      <LayoutWrapper>
        <TitleWrapper>
          <Client className="color-switch">{data?.client?.title || ""}</Client>
          <Title className="color-switch type-h1">
            {data?.title && (
              <HoverTyper
                data={data?.title}
                inView={!triggerAnimation}
                noHoverAnimation={true}
              />
            )}
          </Title>
        </TitleWrapper>
        <DetailsWrapper>
          <LayoutGrid>
            <ClientDetail>
              <DetailTitle className="type-mono-small">Client</DetailTitle>
              <DetailText className="type-mono-small">
                {data?.client?.title || ""}
              </DetailText>
            </ClientDetail>
            <ServicesDetail>
              <DetailTitle className="type-mono-small">Services</DetailTitle>
              <DetailText className="type-mono-small">
                {data?.services || ""}
              </DetailText>
            </ServicesDetail>
            <YearDetail>
              <DetailTitle className="type-mono-small">Year</DetailTitle>
              <DetailText className="type-mono-small">
                {data?.year || ""}
              </DetailText>
            </YearDetail>
            <ProjectDetail>
              <DetailText className="type-mono-small">
                (P-
                {data?.projectIndex !== undefined ? data.projectIndex + 1 : ""})
              </DetailText>
            </ProjectDetail>
          </LayoutGrid>
        </DetailsWrapper>
      </LayoutWrapper>
      <MediaWrapper $animating={triggerAnimation}>
        {data?.heroMedia && <MediaStack data={data?.heroMedia} />}
      </MediaWrapper>
    </NextProjectWrapper>
  );
};

export default NextProject;
