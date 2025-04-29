import styled from "styled-components";
import { SiteSettingsType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";
import Image from "next/image";
import Link from "next/link";
import MediaStack from "../../common/MediaStack";

const PeopleCardWrapper = styled.div`
  display: flex;
  gap: ${pxToRem(20)};
  padding: ${pxToRem(20)} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: ${pxToRem(10)};

  .media-wrapper {
    height: ${pxToRem(84)};
    width: ${pxToRem(84)};
  }
`;

const ContactDetails = styled.div`
  a {
    color: var(--colour-background);
    opacity: 0.5;

    transition: all var(--transition-speed-default) var(--transition-ease);

    &:hover {
      opacity: 1;
    }
  }
`;

const Title = styled.p`
  color: var(--colour-background);
  font-size: 24px;
  line-height: ${pxToRem(27)};
  letter-spacing: -0.24px;
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
