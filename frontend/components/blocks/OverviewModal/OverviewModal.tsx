import styled from "styled-components";
import { HomePageType } from "../../../shared/types/types";
import { motion, AnimatePresence } from "framer-motion";
import pxToRem from "../../../utils/pxToRem";
import CrossIcon from "../../svgs/CrossIcon";
import MediaStack from "../../common/MediaStack";
import OverviewStatisticsCard from "../../elements/OverviewStatisticsCard";
import PrimaryButton from "../../elements/PrimaryButton";
import Link from "next/link";
import { useRef } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";

const TeamModalWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--colour-foreground-alpha-80);
  backdrop-filter: blur(5px);
  cursor: pointer;
`;

const Card = styled(motion.div)`
  max-width: ${pxToRem(720)};
  width: 60%;
  background: var(--colour-foreground);
  border-radius: 10px;
  z-index: 2;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  position: relative;
  cursor: default;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    width: calc(100% - 20px);
  }
`;

const MediaWrapper = styled.div`
  width: 100%;

  .media-wrapper {
    padding-top: 56.25%;
  }
`;

const CloseTrigger = styled.button`
  background: var(--colour-background);
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${pxToRem(24)};
  width: ${pxToRem(24)};
  border-radius: ${pxToRem(6)};
  position: absolute;
  top: ${pxToRem(20)};
  right: ${pxToRem(20)};
  z-index: 2;

  transition: all var(--transition-speed-default) var(--transition-ease);

  &:hover {
    opacity: 0.5;
  }
`;

const ContentWrapper = styled.div`
  padding: ${pxToRem(20)};
`;

const TitlesWrapper = styled.div`
  margin-bottom: ${pxToRem(30)};
`;

const Title = styled.p`
  color: var(--colour-background);
`;

const Description = styled.p`
  color: var(--colour-background);
  margin-bottom: ${pxToRem(30)};
`;

const StatisticsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-column-gap: ${pxToRem(20)};
  grid-row-gap: ${pxToRem(20)};
  align-items: start;
`;

const ButtonWrapper = styled.div`
  padding: ${pxToRem(64)} 0 ${pxToRem(10)};
  display: flex;
  align-items: flex-start;

  .primary-button {
    border: 1px solid var(--colour-background);
  }
`;

const wrapperVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      when: "afterChildren",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      when: "beforeChildren",
    },
  },
};

const cardVariants = {
  hidden: {
    y: "100vh",
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
    },
  },
  visible: {
    y: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
    },
  },
  exit: {
    y: 0,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
    },
  },
};

type Props = {
  isActive: boolean;
  data: false | HomePageType["items"][number]["project"];
  setOverviewModal: React.Dispatch<React.SetStateAction<false | number>>;
};

const OverviewModal = (props: Props) => {
  const { isActive, data, setOverviewModal } = props;
  const {
    client,
    title,
    slug,
    services,
    industries,
    year,
    overviewStatistics,
    overviewDescription,
    heroMedia,
  } = data || {};

  const hasStatistics = overviewStatistics && overviewStatistics.length > 0;

  const ref = useRef<HTMLDivElement>(null!);
  useClickOutside(ref, () => {
    setOverviewModal(false);
  });

  return (
    <AnimatePresence>
      {isActive !== false && (
        <TeamModalWrapper
          variants={wrapperVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <Card
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            data-lenis-prevent
            ref={ref}
          >
            <MediaWrapper>
              {heroMedia && <MediaStack data={heroMedia} />}
              <CloseTrigger onClick={() => setOverviewModal(false)}>
                <CrossIcon />
              </CloseTrigger>
            </MediaWrapper>
            <ContentWrapper>
              <TitlesWrapper>
                <Title>
                  {client?.title || ""}, {title || ""}
                </Title>
                <Title>
                  {services || ""}, {industries || ""}
                </Title>
                <Title>{year || ""}</Title>
              </TitlesWrapper>
              <Description className="type-h4">
                {overviewDescription || ""}
              </Description>
              <StatisticsWrapper>
                {hasStatistics &&
                  [...overviewStatistics, ...overviewStatistics].map(
                    (stat, i) => (
                      <OverviewStatisticsCard
                        value={stat.value}
                        description={stat.description}
                        key={i}
                      />
                    )
                  )}
              </StatisticsWrapper>
              <ButtonWrapper>
                <Link href={`/work/${slug?.current}`}>
                  <PrimaryButton>Full Case Study (↗)</PrimaryButton>
                </Link>
              </ButtonWrapper>
            </ContentWrapper>
          </Card>
        </TeamModalWrapper>
      )}
    </AnimatePresence>
  );
};

export default OverviewModal;
