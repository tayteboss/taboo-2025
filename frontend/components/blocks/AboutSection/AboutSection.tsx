import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";
import InformationTitleSection from "../InformationTitleSection";

const AboutSectionWrapper = styled.section`
  margin-bottom: ${pxToRem(100)};
`;

type Props = {
  data: InformationPageType["aboutUsSection"];
};

const AboutSection = (props: Props) => {
  const { data } = props;

  return (
    <AboutSectionWrapper>
      <InformationTitleSection
        title={data?.title}
        description={data?.description}
        subTitle={data?.subtitle}
      />
    </AboutSectionWrapper>
  );
};

export default AboutSection;
