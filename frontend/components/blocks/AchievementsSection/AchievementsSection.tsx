import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";
import { motion } from "framer-motion";
import pxToRem from "../../../utils/pxToRem";
import HoverTyper from "../../elements/HoverTyper";
import LayoutGrid from "../../layout/LayoutGrid";
import LayoutWrapper from "../../layout/LayoutWrapper";
import { useInView } from "react-intersection-observer";
import AwardCard from "../AwardCard";

const AchievementsSectionWrapper = styled.section`
  margin-bottom: ${pxToRem(200)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    margin-bottom: ${pxToRem(100)};
  }
`;

const Topbar = styled.div`
  margin-bottom: ${pxToRem(100)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    margin-bottom: ${pxToRem(50)};
  }
`;

const Title = styled(motion.h2)`
  grid-column: 1 / 4;
  padding-top: ${pxToRem(10)};
  color: var(--colour-foreground);

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    grid-column: 1 / -1;
    margin-bottom: ${pxToRem(50)};
  }
`;

const DescriptionWrapper = styled.div`
  grid-column: 4 / 10;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    grid-column: 1 / -1;
  }
`;

const Description = styled(motion.div)`
  margin-bottom: ${pxToRem(16)};
  color: var(--colour-foreground);
`;

const Subtitle = styled(motion.p)`
  color: var(--colour-foreground);
`;

const AwardsList = styled.div``;

const AwardsTitles = styled.div`
  margin-bottom: ${pxToRem(20)};
`;

const Blank = styled.div`
  grid-column: span 3;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: none;
  }
`;

const Name = styled.p`
  grid-column: span 5;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    grid-column: span 2;
  }
`;

const Nomination = styled.p`
  grid-column: span 3;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    text-align: right;
    grid-column: span 2;
  }
`;

const Year = styled.p`
  grid-column: span 1;
  text-align: right;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: none;
  }
`;

const fadeInLeftVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

type Props = {
  data: InformationPageType["achievementsSection"];
};

const AchievementsSection = (props: Props) => {
  const {
    data: { title, description, list, subtitle },
  } = props;

  const hasList = list?.length > 0;

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  return (
    <AchievementsSectionWrapper>
      <Topbar>
        <LayoutWrapper>
          <LayoutGrid>
            <Title
              className="type-mono-small color-switch"
              variants={fadeInLeftVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              ref={ref}
            >
              <HoverTyper data={title || ""} inView={inView} />
            </Title>
            {description && (
              <DescriptionWrapper>
                <Description
                  className="type-h1 color-switch"
                  variants={fadeInLeftVariants}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  transition={{ delay: 0.1 }}
                >
                  {description}
                </Description>
                <Subtitle className="type-mono-small color-switch">
                  {subtitle || ""}
                </Subtitle>
              </DescriptionWrapper>
            )}
          </LayoutGrid>
        </LayoutWrapper>
      </Topbar>
      <AwardsList>
        <LayoutWrapper>
          <AwardsTitles>
            <LayoutGrid>
              <Blank />
              <Name className="type-mono-small color-switch">Name</Name>
              <Nomination className="type-mono-small color-switch">
                Nomination
              </Nomination>
              <Year className="type-mono-small color-switch">Year</Year>
            </LayoutGrid>
          </AwardsTitles>
          <AwardsList>
            {hasList &&
              list.map((item, i) => (
                <AwardCard
                  name={item?.name}
                  nominations={item?.nominations}
                  year={item?.year}
                  optionalLink={item?.optionalLink}
                  number={i + 1}
                  key={`${item?.name}-${i}`}
                />
              ))}
          </AwardsList>
        </LayoutWrapper>
      </AwardsList>
    </AchievementsSectionWrapper>
  );
};

export default AchievementsSection;
