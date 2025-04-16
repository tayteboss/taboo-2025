import styled from "styled-components";
import LayoutWrapper from "../../layout/LayoutWrapper";
import LayoutGrid from "../../layout/LayoutGrid";
import { InformationPageType } from "../../../shared/types/types";
import { PortableText } from "@portabletext/react";
import pxToRem from "../../../utils/pxToRem";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import HoverTyper from "../../elements/HoverTyper";

const InformationTitleSectionWrapper = styled.div``;

const Title = styled(motion.h2)`
  grid-column: 1 / 4;
  padding-top: ${pxToRem(10)};
  color: var(--colour-foreground);

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    grid-column: 1 / -1;
    margin-bottom: ${pxToRem(50)};
  }
`;

const Description = styled(motion.div)`
  grid-column: 4 / 10;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    grid-column: 1 / -1;
  }

  p {
    color: var(--colour-foreground-alpha-50);

    transition: color var(--transition-speed-default) var(--transition-ease);
  }

  p strong {
    color: var(--colour-foreground);
    font-weight: 400;

    transition: color var(--transition-speed-default) var(--transition-ease);
  }
`;

const Subtitle = styled(motion.h3)`
  grid-column: 11 / -1;
  padding-top: ${pxToRem(10)};
  color: var(--colour-foreground);

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: none;
  }
`;

const fadeInLeftVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

type Props = {
  title: InformationPageType["aboutUsSection"]["title"];
  description: InformationPageType["aboutUsSection"]["description"];
  subTitle: InformationPageType["aboutUsSection"]["subtitle"];
};

const InformationTitleSection = (props: Props) => {
  const { title, description, subTitle } = props;

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  return (
    <InformationTitleSectionWrapper ref={ref}>
      <LayoutWrapper>
        <LayoutGrid>
          <Title
            className="type-mono-small color-switch"
            variants={fadeInLeftVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <HoverTyper data={title || ""} inView={inView} />
          </Title>
          {description && (
            <Description
              className="type-h2"
              variants={fadeInLeftVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ delay: 0.1 }}
            >
              <PortableText value={description} />
            </Description>
          )}
          <Subtitle
            className="type-mono-small color-switch"
            variants={fadeInLeftVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ delay: 0.2 }}
          >
            <HoverTyper data={subTitle || ""} inView={inView} />
          </Subtitle>
        </LayoutGrid>
      </LayoutWrapper>
    </InformationTitleSectionWrapper>
  );
};

export default InformationTitleSection;
