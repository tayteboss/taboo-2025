import styled from "styled-components";
import { SiteSettingsType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";
import Link from "next/link";
import MediaStack from "../../common/MediaStack";

const PeopleCardWrapper = styled.div`
  display: flex;
  gap: ${pxToRem(20)};
  padding: ${pxToRem(20)} 0;
  border-bottom: 1px solid var(--colour-background-alpha-20);
  width: 100%;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    padding: ${pxToRem(10)};
    gap: ${pxToRem(10)};
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: ${pxToRem(10)};

  .media-wrapper {
    height: ${pxToRem(84)};
    width: ${pxToRem(84)};

    @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
      height: ${pxToRem(60)};
      width: ${pxToRem(60)};
    }
  }
`;

const ContactDetails = styled.div`
  a {
    color: var(--colour-background);
    opacity: 0.5;

    transition: all var(--transition-speed-default) var(--transition-ease);

    @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
      color: var(--colour-black);
    }

    &:hover {
      opacity: 1;
    }
  }
`;

const Title = styled.p`
  color: var(--colour-background);
  font-size: ${pxToRem(24)};
  line-height: ${pxToRem(27)};
  letter-spacing: -0.24px;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    color: var(--colour-black);
    font-size: ${pxToRem(16)};
    line-height: ${pxToRem(18)};
    letter-spacing: -0.16px;
  }
`;

type Props = {
  data: SiteSettingsType["personalContacts"][number];
};

const PeopleCard = (props: Props) => {
  const { data } = props;
  return (
    <PeopleCardWrapper>
      {data?.media && (
        <ImageWrapper>
          <MediaStack
            data={data.media}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </ImageWrapper>
      )}
      <ContactDetails>
        <Title>{data?.name || ""}</Title>
        <Title>{data?.role || ""}</Title>
        <Link href={`mailto:${data?.email}`} className="type-mono-small">
          {data?.email}
        </Link>
      </ContactDetails>
    </PeopleCardWrapper>
  );
};

export default PeopleCard;
