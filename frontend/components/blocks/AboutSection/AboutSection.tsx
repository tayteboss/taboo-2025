import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";

const AboutSectionWrapper = styled.section``;

type Props = {
  data: InformationPageType["aboutUsSection"];
};

const AboutSection = (props: Props) => {
  const { data } = props;

  return <AboutSectionWrapper>AboutSection</AboutSectionWrapper>;
};

export default AboutSection;
