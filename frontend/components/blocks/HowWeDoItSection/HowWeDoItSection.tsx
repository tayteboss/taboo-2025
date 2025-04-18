import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";
import LayoutWrapper from "../../layout/LayoutWrapper";
import LayoutGrid from "../../layout/LayoutGrid";
import ListCard from "../../elements/ListCard";
import { delay, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const HowWeDoItSectionWrapper = styled.section`
  margin-bottom: ${pxToRem(200)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    margin-bottom: ${pxToRem(100)};
  }
`;

const Title = styled.h2`
  margin-bottom: ${pxToRem(100)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: none;
  }
`;

const ListWrapper = styled(motion.div)`
  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    .layout-grid {
      grid-row-gap: ${pxToRem(20)};
    }
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
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

type Props = {
  data: InformationPageType["howDoWeDoItSection"];
};

const HowWeDoItSection = (props: Props) => {
  const {
    data: { title, list },
  } = props;

  const hasList = list?.length > 0;

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  return (
    <HowWeDoItSectionWrapper>
      <LayoutWrapper>
        <Title className="type-mono-small color-switch">{title || ""}</Title>
        <ListWrapper
          variants={wrapperVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          ref={ref}
        >
          <LayoutGrid>
            {hasList &&
              list.map((item, i) => (
                <ListCard
                  title={item?.title}
                  list={item?.itemList}
                  index={i}
                  key={`${item?.title}-${i}`}
                />
              ))}
          </LayoutGrid>
        </ListWrapper>
      </LayoutWrapper>
    </HowWeDoItSectionWrapper>
  );
};

export default HowWeDoItSection;
