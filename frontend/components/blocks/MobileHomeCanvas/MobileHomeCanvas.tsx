import styled from "styled-components";

const MobileHomeCanvasWrapper = styled.div``;

type Props = {
  data: any;
};

const MobileHomeCanvas = (props: Props) => {
  const { data } = props;
  return <MobileHomeCanvasWrapper>MobileHomeCanvas</MobileHomeCanvasWrapper>;
};

export default MobileHomeCanvas;
