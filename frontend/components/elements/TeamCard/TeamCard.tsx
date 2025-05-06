import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";
import Image from "next/image";
import PrimaryButton from "../PrimaryButton";
import pxToRem from "../../../utils/pxToRem";
import { useState } from "react";
import MediaStack from "../../common/MediaStack";

const TeamCardWrapper = styled.div`
  width: 100%;

  &:hover {
    .bio-trigger {
      opacity: 1;
      transform: translateY(0);
    }

    img {
      transform: scale(1.04);
    }
  }

  img {
    transition: all var(--transition-speed-default) var(--transition-ease);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  padding-top: 125%;
  position: relative;
  overflow: hidden;

  &.view-element-difference {
    &::before {
      transition-delay: 300ms;
    }
  }
`;

const ImageInner = styled.div`
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  overflow: hidden;
  border-radius: ${pxToRem(15)};
`;

const HoverMediaWrapper = styled.div<{ $isActive: boolean }>`
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  z-index: 2;
  opacity: ${(props) => (props.$isActive ? 1 : 0)};

  transition: all var(--transition-speed-default) var(--transition-ease);

  * {
    height: 100%;
    width: 100%;
  }
`;

const ContentWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${pxToRem(30)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    padding: ${pxToRem(16)};
  }
`;

const TitleWrapper = styled.div``;

const Title = styled.p`
  color: var(--colour-white);
`;

const Position = styled.p`
  color: var(--colour-white);
  opacity: 0.5;
`;

const Trigger = styled.button`
  opacity: 0;
  transform: translateY(10px);

  transition: all var(--transition-speed-default) var(--transition-ease);

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    opacity: 1;
    transform: translateY(0);
  }
`;

type Props = {
  name: InformationPageType["teamSection"]["teamMembers"][number]["name"];
  image: InformationPageType["teamSection"]["teamMembers"][number]["image"];
  position: InformationPageType["teamSection"]["teamMembers"][number]["position"];
  hoverMedia: InformationPageType["teamSection"]["teamMembers"][number]["hoverMedia"];
  index: number;
  setTeamModalIsActive: (index: number) => void;
};

const TeamCard = (props: Props) => {
  const { name, image, position, index, hoverMedia, setTeamModalIsActive } =
    props;

  const [isHovered, setIsHovered] = useState(false);

  return (
    <TeamCardWrapper
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      {image?.asset?.url && (
        <ImageWrapper>
          <ContentWrapper>
            <TitleWrapper>
              <Title className="color-switch">{name}</Title>
              <Position className="color-switch">{position}</Position>
            </TitleWrapper>
            <Trigger
              className="bio-trigger"
              onClick={() => setTeamModalIsActive(index)}
            >
              <PrimaryButton>Read Bio (↗)</PrimaryButton>
            </Trigger>
          </ContentWrapper>
          <ImageInner>
            <Image
              src={image.asset.url}
              alt={`${name} team image`}
              fill
              style={{
                objectFit: "cover",
              }}
              sizes="(max-width: 600px) 70vw, 33vw"
            />
            {hoverMedia && (
              <HoverMediaWrapper $isActive={isHovered}>
                <MediaStack
                  data={hoverMedia}
                  sizes="(max-width: 600px) 70vw, 33vw"
                  lazyLoad
                />
              </HoverMediaWrapper>
            )}
          </ImageInner>
        </ImageWrapper>
      )}
    </TeamCardWrapper>
  );
};

export default TeamCard;
