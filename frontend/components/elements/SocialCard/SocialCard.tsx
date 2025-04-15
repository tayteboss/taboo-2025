import styled from "styled-components";
import { SiteSettingsType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";

const SocialCardWrapper = styled.a`
  font-size: ${pxToRem(11)};
  text-transform: uppercase;
  padding: ${pxToRem(4)} ${pxToRem(6)} ${pxToRem(3)};
  background: var(--colour-foreground);
  color: var(--colour-background);
  border-radius: ${pxToRem(6)};

  transition: all var(--transition-speed-default) var(--transition-ease);

  &:hover {
    background: var(--colour-background);
    color: var(--colour-foreground);
  }
`;

type Props = {
  data: SiteSettingsType["socialLinks"][number];
};

const SocialCard = (props: Props) => {
  const { data } = props;
  return (
    <SocialCardWrapper href={data?.link} className="type-mono">
      {data?.title || ""}
    </SocialCardWrapper>
  );
};

export default SocialCard;
