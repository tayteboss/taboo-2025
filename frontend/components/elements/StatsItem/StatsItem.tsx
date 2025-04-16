import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";
import { motion } from "framer-motion";

const StatsItemWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${pxToRem(10)};
  flex: 1;
`;

const Value = styled.p`
  color: var(--colour-background);
`;

const Title = styled.p`
  color: var(--colour-background);
`;

const wrapperVariants = {
  hidden: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

type Props = {
  value: InformationPageType["statisticsSection"]["statistics"][number]["value"];
  title: InformationPageType["statisticsSection"]["statistics"][number]["title"];
};

const StatsItem = (props: Props) => {
  const { value, title } = props;
  return (
    <StatsItemWrapper variants={wrapperVariants}>
      <Value className="type-h1 type-mono">{value || ""}</Value>
      <Title className="color-switch type-mono-small">{title || ""}</Title>
    </StatsItemWrapper>
  );
};

export default StatsItem;
