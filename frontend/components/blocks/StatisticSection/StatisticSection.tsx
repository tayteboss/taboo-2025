import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";

const StatisticSectionWrapper = styled.section`
  height: 50vh;
`;

type Props = {
  data: InformationPageType["statisticsSection"];
};

const StatisticSection = (props: Props) => {
  const { data } = props;

  return <StatisticSectionWrapper>StatisticSection</StatisticSectionWrapper>;
};

export default StatisticSection;
