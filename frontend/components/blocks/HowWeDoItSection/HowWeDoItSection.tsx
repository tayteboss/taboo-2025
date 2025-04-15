import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";

const HowWeDoItSectionWrapper = styled.section``;

type Props = {
  data: InformationPageType["howDoWeDoItSection"];
};

const HowWeDoItSection = (props: Props) => {
  const { data } = props;

  return <HowWeDoItSectionWrapper>HowWeDoItSection</HowWeDoItSectionWrapper>;
};

export default HowWeDoItSection;
