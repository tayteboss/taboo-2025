import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";
import LayoutWrapper from "../../layout/LayoutWrapper";
import useEmblaCarousel from "embla-carousel-react";
import TeamCard from "../../elements/TeamCard";
import pxToRem from "../../../utils/pxToRem";
import { useEffect, useState } from "react";
import TeamModal from "../TeamModal";
import { useLenis } from "@studio-freight/react-lenis";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const TeamSectionWrapper = styled.section`
  margin-bottom: ${pxToRem(200)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    margin-bottom: ${pxToRem(100)};
  }
`;

const Title = styled.h2`
  margin-bottom: ${pxToRem(20)};
`;

const Embla = styled.div`
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Container = styled(motion.div)`
  gap: ${pxToRem(20)};
  margin: 0 ${pxToRem(20)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    margin: 0 ${pxToRem(10)};
    gap: ${pxToRem(10)};
  }
`;

const Slide = styled(motion.div)`
  flex: 0 0 30vw;

  @media ${(props) => props.theme.mediaBreakpoints.tabletMedium} {
    flex: 0 0 40vw;
  }

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    flex: 0 0 50vw;
  }

  @media ${(props) => props.theme.mediaBreakpoints.mobile} {
    flex: 0 0 70vw;
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

const childVariants = {
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
  data: InformationPageType["teamSection"];
};

const TeamSection = (props: Props) => {
  const {
    data: { title, teamMembers },
  } = props;

  const [teamModalIsActive, setTeamModalIsActive] = useState<false | number>(
    false
  );

  const hasTeamMembers = teamMembers?.length > 0;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    skipSnaps: false,
    containScroll: "trimSnaps",
  });

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  const lenis = useLenis(({ scroll }) => {});

  useEffect(() => {
    if (!lenis) return;

    if (teamModalIsActive !== false) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [teamModalIsActive]);

  return (
    <>
      <TeamSectionWrapper ref={ref}>
        <LayoutWrapper>
          <Title className="type-mono-small color-switch">{title || ""}</Title>
        </LayoutWrapper>
        <Embla className="embla" ref={emblaRef}>
          <Container
            className="embla__container"
            variants={wrapperVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            exit="hidden"
          >
            {hasTeamMembers &&
              teamMembers?.map((teamMember, index) => (
                <Slide
                  className="embla__slide"
                  key={index}
                  variants={childVariants}
                >
                  <TeamCard
                    name={teamMember?.name}
                    image={teamMember?.image}
                    hoverMedia={teamMember?.hoverMedia}
                    position={teamMember?.position}
                    index={index}
                    key={`${teamMember?.name}-${index}`}
                    setTeamModalIsActive={setTeamModalIsActive}
                  />
                </Slide>
              ))}
          </Container>
        </Embla>
      </TeamSectionWrapper>
      <TeamModal
        isActive={teamModalIsActive}
        members={teamMembers}
        setTeamModalIsActive={setTeamModalIsActive}
      />
    </>
  );
};

export default TeamSection;
