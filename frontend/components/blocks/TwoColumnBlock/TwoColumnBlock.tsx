import styled from "styled-components";

const TwoColumnBlockWrapper = styled.section``;

type Props = {
  data: any;
};

const TwoColumnBlock = (props: Props) => {
  const { data } = props;
  return <TwoColumnBlockWrapper>TwoColumnBlock</TwoColumnBlockWrapper>;
};

export default TwoColumnBlock;
