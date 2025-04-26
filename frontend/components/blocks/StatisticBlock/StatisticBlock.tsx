import styled from "styled-components";

const StatisticBlockWrapper = styled.section``;

type Props = {
  data: any;
};

const StatisticBlock = (props: Props) => {
  const { data } = props;
  return <StatisticBlockWrapper>StatisticBlock</StatisticBlockWrapper>;
};

export default StatisticBlock;
