import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import pxToRem from "../../../utils/pxToRem";
import CrossIcon from "../../svgs/CrossIcon";
import FilterList from "../FilterList";
import { useRef } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";

const FiltersModalWrapper = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background: var(--colour-foreground-alpha-80);
  backdrop-filter: blur(5px);
`;

const Card = styled(motion.div)`
  width: ${pxToRem(478)};
  background: var(--colour-background);
  border-radius: 10px;
  padding: 20px;
  z-index: 2;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  margin-bottom: ${pxToRem(10)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    width: calc(100% - 20px);
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${pxToRem(20)};
  margin-bottom: ${pxToRem(50)};
`;

const Title = styled.p`
  color: var(--colour-foreground);
`;

const CloseTrigger = styled.button`
  background: var(--colour-foreground);
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${pxToRem(24)};
  width: ${pxToRem(24)};
  border-radius: ${pxToRem(6)};

  transition: all var(--transition-speed-default) var(--transition-ease);

  &:hover {
    opacity: 0.5;
  }

  svg {
    path {
      stroke: var(--colour-background);
    }
  }
`;

const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${pxToRem(50)};
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
  services: Array<{ title: string; value: string }>;
  industries: Array<{ title: string; value: string }>;
  activeService: string;
  activeIndustry: string;
  setActiveService: React.Dispatch<React.SetStateAction<string>>;
  setActiveIndustry: React.Dispatch<React.SetStateAction<string>>;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const FiltersModal = (props: Props) => {
  const {
    isActive,
    services,
    industries,
    activeService,
    activeIndustry,
    setActiveService,
    setActiveIndustry,
    setIsActive,
  } = props;

  const ref = useRef<HTMLDivElement>(null!);

  useClickOutside(ref, () => {
    setIsActive(false);
  });

  return (
    <AnimatePresence>
      {isActive !== false && (
        <FiltersModalWrapper
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
            <TitleWrapper>
              <Title className="color-switch type-mono type-h4">
                Apply Filters
              </Title>
              <CloseTrigger
                onClick={() => setIsActive(false)}
                role="button"
                aria-label="Close"
                tabIndex={-1}
              >
                <CrossIcon />
              </CloseTrigger>
            </TitleWrapper>
            <FiltersWrapper>
              <FilterList
                data={services}
                active={activeService}
                setActive={setActiveService}
                className="services-list"
              />
              <FilterList
                data={industries}
                active={activeIndustry}
                setActive={setActiveIndustry}
                className="industries-list"
              />
            </FiltersWrapper>
          </Card>
        </FiltersModalWrapper>
      )}
    </AnimatePresence>
  );
};

export default FiltersModal;
