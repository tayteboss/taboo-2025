import styled from "styled-components";
import LayoutWrapper from "../../layout/LayoutWrapper";
import LayoutGrid from "../../layout/LayoutGrid";
import CrossIcon from "../../svgs/CrossIcon";
import { useState } from "react";
import pxToRem from "../../../utils/pxToRem";
import { AnimatePresence, delay, motion } from "framer-motion";

const AccordionWrapper = styled.div`
  padding: ${pxToRem(100)} 0;
`;

const Inner = styled.div`
  grid-column: 4 / -4;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${pxToRem(24)};
`;

const ListItemWrapper = styled.div`
  padding-bottom: ${pxToRem(20)};
  border-bottom: 1px solid var(--colour-foreground-alpha-20);
  cursor: pointer;
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
  transform: ${(props) => (props.$isActive ? "rotate(45deg)" : "rotate(0deg)")};

  transition: transform var(--transition-speed-default) var(--transition-ease);
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

type Props = {
  data: any;
};

const Accordion = (props: Props) => {
  const { data } = props;

  return (
    <AccordionWrapper>
      <LayoutWrapper>
        <LayoutGrid>
          <Inner>
            <ListWrapper>
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
    <ListItemWrapper onClick={() => setIsActive(!isActive)}>
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
