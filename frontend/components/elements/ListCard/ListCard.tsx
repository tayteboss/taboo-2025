import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";
import HoverTyper from "../HoverTyper";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const ListCardWrapper = styled(motion.div)`
  grid-column: span 3;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    grid-column: 1 / -1;

    &:nth-child(2n) {
      .list-card-title {
        text-align: right;
      }

      .hover-typer {
        justify-content: flex-end;
      }
    }
  }
`;

const Title = styled.h4`
  margin-bottom: ${pxToRem(20)};
  color: var(--colour-foreground);

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    margin-bottom: ${pxToRem(16)};
  }
`;

const ListWrapper = styled(motion.ul)``;

const ListItemWrapper = styled(motion.li)``;

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

const innerVariants = {
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

const ListItem = ({ item, index }: { item: string; index: number }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  return (
    <ListItemWrapper
      variants={childVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      ref={ref}
      className="type-h4 color-switch"
    >
      <HoverTyper data={item} inView={inView} />
    </ListItemWrapper>
  );
};

type Props = {
  title: InformationPageType["howDoWeDoItSection"]["list"][number]["title"];
  list: InformationPageType["howDoWeDoItSection"]["list"][number]["itemList"];
  index: number;
};

const ListCard = (props: Props) => {
  const { title, list, index } = props;

  const hasList = list?.length > 0;

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  return (
    <ListCardWrapper
      variants={wrapperVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      ref={ref}
    >
      <Title className="color-switch type-mono-small list-card-title">
        ({index + 1}) {title || ""}
      </Title>
      <ListWrapper variants={innerVariants}>
        {hasList &&
          list.map((item, i) => (
            <ListItem key={`${item}-${i}`} item={item} index={i} />
          ))}
      </ListWrapper>
    </ListCardWrapper>
  );
};

export default ListCard;
