import styled from "styled-components";
import { SiteSettingsType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";

const CreditCardWrapper = styled.a`
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

const CreditCard = (props: Props) => {
  const { data } = props;
  return (
    <CreditCardWrapper
      href={data?.link}
      target="_blank"
      className="type-mono social-card"
    >
      {data?.title || ""}
    </CreditCardWrapper>
  );
};

export default CreditCard;
