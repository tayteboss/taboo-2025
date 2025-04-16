import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";
import InformationTitleSection from "../InformationTitleSection";
import Accordion from "../Accordion";
import pxToRem from "../../../utils/pxToRem";

const PrinciplesSectionWrapper = styled.section`
  margin-bottom: ${pxToRem(100)};
`;

type Props = {
  data: InformationPageType["principlesSection"];
};

const PrinciplesSection = (props: Props) => {
  const { data } = props;

  const hasList = data?.list?.length > 0;

  return (
    <PrinciplesSectionWrapper>
      <InformationTitleSection
        title={data?.title}
        description={data?.description}
        subTitle={data?.subtitle}
      />
      {hasList && <Accordion data={data?.list} />}
    </PrinciplesSectionWrapper>
  );
};

export default PrinciplesSection;
