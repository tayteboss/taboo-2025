import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";
import LayoutGrid from "../../layout/LayoutGrid";
import Link from "next/link";
import HoverTyper from "../../elements/HoverTyper";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const AwardCardWrapper = styled(motion.div)<{ $hasLink: boolean }>`
  * {
    cursor: ${(props) => props.$hasLink && "pointer"};
    color: var(--colour-foreground);
  }

  a {
    .hover-bar {
      position: relative;

      &::before {
        content: "";
        position: absolute;
        left: -6px;
        bottom: -1px;
        width: calc(100% + 12px);
        height: 0;
        background: var(--colour-foreground);
        z-index: -1;
        border-radius: 2px;

        transition: all 100ms var(--transition-ease);
        transition-delay: 150ms;
      }
    }

    &:hover {
      * {
        color: var(--colour-background);
      }

      .hover-bar {
        color: var(--colour-background);

        &::before {
          height: 100%;
          right: 0;
          transition-delay: 0ms;
        }
      }
    }
  }
`;

const Number = styled.div`
  grid-column: span 3;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: none;
  }
`;

const Name = styled.div`
  grid-column: span 5;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    grid-column: span 2;
  }
`;

const Nomination = styled.div`
  grid-column: span 3;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    text-align: right;
    align-self: right;
    grid-column: span 2;

    * {
      text-align: right;
    }
  }
`;

const Year = styled.div`
  grid-column: span 1;
  text-align: right;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: none;
  }
`;

const DesktopWrapper = styled.div`
  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: none;
  }
`;

const MobileWrapper = styled.div`
  display: none;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: block;
  }
`;

type Props = {
  name: InformationPageType["achievementsSection"]["list"][number]["name"];
  nominations: InformationPageType["achievementsSection"]["list"][number]["nominations"];
  year: InformationPageType["achievementsSection"]["list"][number]["year"];
  optionalLink: InformationPageType["achievementsSection"]["list"][number]["optionalLink"];
  number: number;
};

const AwardCard = (props: Props) => {
  const { name, nominations, year, optionalLink, number } = props;

  const formatNumber = (number: number) => {
    if (number < 10) {
      return `0${number}`;
    } else {
      return number.toString();
    }
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  const content = (
    <>
      <Number className="type-h4 type-mono color-switch">
        <HoverTyper data={formatNumber(number)} inView={inView} />
      </Number>
      <Name className="type-h4 type-mono color-switch hover-bar">
        <DesktopWrapper>
          <HoverTyper data={name || ""} inView={inView} />
        </DesktopWrapper>
        <MobileWrapper>{name || ""}</MobileWrapper>
      </Name>
      <Nomination className="type-h4 type-mono color-switch hover-bar">
        <DesktopWrapper>
          <HoverTyper data={nominations || ""} inView={inView} />
        </DesktopWrapper>
        <MobileWrapper>{nominations || ""}</MobileWrapper>
      </Nomination>
      <Year className="type-h4 type-mono color-switch hover-bar">
        <HoverTyper data={year || ""} inView={inView} />
      </Year>
    </>
  );

  return (
    <AwardCardWrapper
      ref={ref}
      $hasLink={!!optionalLink}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {optionalLink ? (
        <Link href={optionalLink} target="_blank" passHref>
          <LayoutGrid>{content}</LayoutGrid>
        </Link>
      ) : (
        <LayoutGrid>{content}</LayoutGrid>
      )}
    </AwardCardWrapper>
  );
};

export default AwardCard;
