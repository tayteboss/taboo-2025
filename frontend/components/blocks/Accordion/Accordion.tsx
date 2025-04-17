import styled from "styled-components";
import LayoutWrapper from "../../layout/LayoutWrapper";
import LayoutGrid from "../../layout/LayoutGrid";
import CrossIcon from "../../svgs/CrossIcon";
import { useState } from "react";
import pxToRem from "../../../utils/pxToRem";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const AccordionWrapper = styled.div`
  padding: ${pxToRem(100)} 0;
`;

const Inner = styled.div`
  grid-column: 4 / -4;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    grid-column: 1 / -1;
  }
`;

const ListWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${pxToRem(24)};
`;

const ListItemWrapper = styled(motion.div)<{ $isActive: boolean }>`
  padding-bottom: ${pxToRem(20)};
  border-bottom: 1px solid
    ${(props) =>
      props.$isActive
        ? "var(--colour-foreground-alpha-50)"
        : "var(--colour-foreground-alpha-20)"};
  cursor: pointer;

  transition: border-bottom var(--transition-speed-default)
    var(--transition-ease);

  &:hover {
    border-color: var(--colour-foreground-alpha-50);
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3``;

const DescriptionWrapper = styled(motion.div)``;

const DescriptionInner = styled(motion.div)`
  padding: ${pxToRem(24)} 0 ${pxToRem(20)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    padding: ${pxToRem(16)} ${pxToRem(8)} ${pxToRem(8)} 0;
  }
`;

const TriggerWrapper = styled.div<{ $isActive: boolean }>`
  width: ${pxToRem(24)};
  height: ${pxToRem(24)};
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) =>
    props.$isActive ? "var(--colour-foreground)" : "var(--colour-grey)"};
  border-radius: ${pxToRem(6)};

  transition: background var(--transition-speed-default) var(--transition-ease);

  svg {
    path {
      stroke: ${(props) =>
        props.$isActive
          ? "var(--colour-background)"
          : "var(--colour-foreground)"};

      transition: all var(--transition-speed-default) var(--transition-ease);
    }
  }
`;

const TriggerInner = styled.div<{ $isActive: boolean }>`
  transform: ${(props) => (props.$isActive ? "rotate(0deg)" : "rotate(45deg)")};
  opacity: ${(props) => (props.$isActive ? 1 : 0.5)};
  display: flex;
  justify-content: center;
  align-items: center;

  transition: all var(--transition-speed-default) var(--transition-ease);
`;

const wrapperVariants = {
  hidden: {
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      when: "afterChildren",
    },
  },
  visible: {
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      when: "afterChildren",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      when: "beforeChildren",
    },
  },
};

const outerVariants = {
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
      delayChildren: 0.3,
    },
  },
};

const innerVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

type Props = {
  data: any;
};

const Accordion = (props: Props) => {
  const { data } = props;

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  return (
    <AccordionWrapper>
      <LayoutWrapper>
        <LayoutGrid>
          <Inner>
            <ListWrapper
              ref={ref}
              variants={outerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {data?.map((item: any, index: number) => (
                <ListItem key={index} data={item} />
              ))}
            </ListWrapper>
          </Inner>
        </LayoutGrid>
      </LayoutWrapper>
    </AccordionWrapper>
  );
};

const ListItem = ({ data }: { data: any }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <ListItemWrapper
      onClick={() => setIsActive(!isActive)}
      $isActive={isActive}
      variants={innerVariants}
    >
      <TopBar>
        <Title className="type-mono-small color-switch">{data?.title}</Title>
        <TriggerWrapper $isActive={isActive}>
          <TriggerInner $isActive={isActive}>
            <CrossIcon />
          </TriggerInner>
        </TriggerWrapper>
      </TopBar>

      <AnimatePresence>
        {isActive && (
          <DescriptionWrapper
            variants={wrapperVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <DescriptionInner
              variants={itemVariants}
              className="type-p color-switch"
            >
              {data?.description}
            </DescriptionInner>
          </DescriptionWrapper>
        )}
      </AnimatePresence>
    </ListItemWrapper>
  );
};

export default Accordion;
