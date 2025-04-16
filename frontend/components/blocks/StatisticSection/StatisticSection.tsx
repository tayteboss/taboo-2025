import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";
import LayoutWrapper from "../../layout/LayoutWrapper";
import MediaStack from "../../common/MediaStack";
import pxToRem from "../../../utils/pxToRem";
import StatsItem from "../../elements/StatsItem";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const StatisticSectionWrapper = styled.section``;

const MediaWrapper = styled.div`
  overflow: hidden;
  border-radius: ${pxToRem(15)};
  position: relative;

  .media-wrapper {
    height: calc(100vh - 40px);

    @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
      height: calc(100vh - 20px);
      min-height: ${pxToRem(650)};
    }
  }
`;

const StatsWrapper = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0 ${pxToRem(20)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  z-index: 2;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    padding: ${pxToRem(80)} ${pxToRem(10)};
    flex-direction: column;
    height: 100%;
  }
`;

const wrapperVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.01,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.01,
      ease: "easeInOut",
      staggerChildren: 0.1,
    },
  },
};

type Props = {
  data: InformationPageType["statisticsSection"];
};

const StatisticSection = (props: Props) => {
  const { data } = props;

  const hasStats = data?.statistics?.length > 0;

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  return (
    <StatisticSectionWrapper>
      <LayoutWrapper>
        {data?.mediaBackground && (
          <MediaWrapper>
            {hasStats && (
              <StatsWrapper
                variants={wrapperVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                ref={ref}
              >
                {data.statistics.map((item, i) => (
                  <StatsItem value={item?.value} title={item?.title} key={i} />
                ))}
              </StatsWrapper>
            )}
            <MediaStack data={data.mediaBackground} />
          </MediaWrapper>
        )}
      </LayoutWrapper>
    </StatisticSectionWrapper>
  );
};

export default StatisticSection;
