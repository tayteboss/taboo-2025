import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import LayoutWrapper from "../../layout/LayoutWrapper";
import LayoutGrid from "../../layout/LayoutGrid";
import pxToRem from "../../../utils/pxToRem";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const StatisticBlockWrapper = styled.section``;

const StatisticItem = styled(motion.div)<{ $gridColSpan: string }>`
  grid-column: ${(props) => props.$gridColSpan};
  background: var(--colour-grey);
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: ${pxToRem(15)};
  padding: ${pxToRem(80)} ${pxToRem(40)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    grid-column: 1 / -1;
  }
`;

const Title = styled.p`
  color: var(--colour-foreground);
  text-align: center;
`;

const Description = styled.p`
  color: var(--colour-foreground);
  text-align: center;
`;

const variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      staggerChildren: 0.2,
    },
  },
};

const childVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

type Props = {
  statisticBlock: ProjectType["pageBuilder"][number]["statisticBlock"];
};

const StatisticBlock = (props: Props) => {
  const { statisticBlock } = props;

  const hasData = statisticBlock && statisticBlock?.length > 0;

  const gridColSpan = () => {
    if (statisticBlock?.length === 1) return "1 / -1";
    if (statisticBlock?.length === 2) return "span 6";
    return "span 4";
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  return (
    <StatisticBlockWrapper ref={ref}>
      <LayoutWrapper>
        {hasData && (
          <motion.div
            variants={variants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <LayoutGrid>
              {statisticBlock.map((item, i) => {
                return (
                  <StatisticItem
                    key={`${item?.value || "stat-block"}-${i}`}
                    $gridColSpan={gridColSpan()}
                    variants={childVariants}
                  >
                    {item?.value && (
                      <Title className="type-h2 color-switch">
                        {item.value}
                      </Title>
                    )}
                    {item?.description && (
                      <Description className="type-mono-small color-switch">
                        {item.description}
                      </Description>
                    )}
                  </StatisticItem>
                );
              })}
            </LayoutGrid>
          </motion.div>
        )}
      </LayoutWrapper>
    </StatisticBlockWrapper>
  );
};

export default StatisticBlock;
