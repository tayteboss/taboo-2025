import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";
import { motion, AnimatePresence } from "framer-motion";
import pxToRem from "../../../utils/pxToRem";
import { useEffect, useRef, useState } from "react";
import CrossIcon from "../../svgs/CrossIcon";
import Image from "next/image";
import formatHTML from "../../../utils/formatHTML";
import SocialCard from "../../elements/SocialCard";
import { useClickOutside } from "../../../hooks/useClickOutside";
import MediaStack from "../../common/MediaStack";

const TeamModalWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--colour-foreground-alpha-80);
  backdrop-filter: blur(5px);
  cursor: pointer;
`;

const Card = styled(motion.div)`
  width: ${pxToRem(478)};
  background: var(--colour-foreground);
  border-radius: 10px;
  padding: 20px;
  z-index: 2;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  cursor: default;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    width: calc(100% - 20px);
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${pxToRem(20)};
`;

const NameWrapper = styled.div``;

const Title = styled.p`
  font-size: ${pxToRem(24)};
  color: var(--colour-background);
`;

const Position = styled.p`
  font-size: ${pxToRem(24)};
  color: var(--colour-background-alpha-50);
`;

const CloseTrigger = styled.button`
  background: var(--colour-background);
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
`;

const ImageWrapper = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;
  overflow: hidden;
  border-radius: ${pxToRem(10)};
  margin-bottom: ${pxToRem(20)};
`;

const ImageInner = styled.div`
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
`;

const DescriptionWrapper = styled.div`
  * {
    color: var(--colour-background);
  }
`;

const Description = styled.div``;

const SocialDetails = styled.div`
  display: flex;
  gap: ${pxToRem(10)};
  padding-top: ${pxToRem(50)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    padding-top: ${pxToRem(32)};
  }
`;

const HoverMediaWrapper = styled.div`
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  z-index: 2;

  transition: all var(--transition-speed-default) var(--transition-ease);

  * {
    height: 100%;
    width: 100%;
  }
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
  isActive: false | number;
  members: InformationPageType["teamSection"]["teamMembers"];
  setTeamModalIsActive: React.Dispatch<React.SetStateAction<false | number>>;
};

const TeamModal = (props: Props) => {
  const { isActive, members, setTeamModalIsActive } = props;
  const [data, setData] = useState<
    InformationPageType["teamSection"]["teamMembers"][number] | null
  >(null);

  useEffect(() => {
    if (isActive === false) {
      setData(null);
    } else {
      setData(members[isActive]);
    }
  }, [members, isActive]);

  const ref = useRef<HTMLDivElement>(null!);
  useClickOutside(ref, () => {
    setTeamModalIsActive(false);
  });

  return (
    <AnimatePresence>
      {isActive !== false && (
        <TeamModalWrapper
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
              <NameWrapper>
                <Title className="color-switch">{data?.name || ""}</Title>
                <Position className="color-switch">
                  {data?.position || ""}
                </Position>
              </NameWrapper>
              <CloseTrigger onClick={() => setTeamModalIsActive(false)}>
                <CrossIcon />
              </CloseTrigger>
            </TitleWrapper>
            <ImageWrapper>
              <ImageInner>
                {data?.hoverMedia && (
                  <HoverMediaWrapper>
                    <MediaStack
                      data={data?.hoverMedia}
                      sizes="(max-width: 600px) 100vw, 50vw"
                    />
                  </HoverMediaWrapper>
                )}
                {!data?.hoverMedia && data?.image?.asset?.url && (
                  <Image
                    src={data?.image.asset.url}
                    alt={`${data?.name} team image`}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    sizes="(max-width: 600px) 100vw, 50vw"
                  />
                )}
              </ImageInner>
            </ImageWrapper>
            <DescriptionWrapper className="type-h4 color-switch">
              {data?.description && (
                <Description
                  dangerouslySetInnerHTML={{
                    __html: formatHTML(data?.description),
                  }}
                />
              )}
            </DescriptionWrapper>
            {data && data?.socialLinks && data?.socialLinks?.length > 0 && (
              <SocialDetails>
                {data.socialLinks.map((social, i) => (
                  <SocialCard data={social} key={i} />
                ))}
              </SocialDetails>
            )}
          </Card>
        </TeamModalWrapper>
      )}
    </AnimatePresence>
  );
};

export default TeamModal;
