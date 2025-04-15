import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";

const ClientLogosSectionWrapper = styled.section``;

type Props = {
  data: InformationPageType["featuredClientLogosSection"];
};

const ClientLogosSection = (props: Props) => {
  const { data } = props;

  return (
    <ClientLogosSectionWrapper>ClientLogosSection</ClientLogosSectionWrapper>
  );
};

export default ClientLogosSection;
