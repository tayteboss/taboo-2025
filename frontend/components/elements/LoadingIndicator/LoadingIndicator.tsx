import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";
import { motion } from "framer-motion";

const LoadingIndicatorWrapper = styled(motion.div)`
  position: absolute;
  top: ${pxToRem(20)};
  right: ${pxToRem(20)};
  background: var(--colour-background);
  color: var(--colour-foreground-alpha-50);
  padding: ${pxToRem(3)} ${pxToRem(6)} ${pxToRem(4)};
  border-radius: ${pxToRem(6)};
  z-index: 2;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    bottom: ${pxToRem(15)};
    left: ${pxToRem(15)};
  }
`;

const wrapperVariants = {
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

const LoadingIndicator = () => {
  return (
    <LoadingIndicatorWrapper
      className="type-mono-small"
      variants={wrapperVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      Loading
    </LoadingIndicatorWrapper>
  );
};

export default LoadingIndicator;
