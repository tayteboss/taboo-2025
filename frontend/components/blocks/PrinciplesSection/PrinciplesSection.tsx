import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";

const PrinciplesSectionWrapper = styled.section``;

type Props = {
  data: InformationPageType["principlesSection"];
};

const PrinciplesSection = (props: Props) => {
  const { data } = props;

  return <PrinciplesSectionWrapper>PrinciplesSection</PrinciplesSectionWrapper>;
};

export default PrinciplesSection;
