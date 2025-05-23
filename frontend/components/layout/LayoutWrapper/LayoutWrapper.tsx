import { ReactNode } from "react";
import styled from "styled-components";
import pxToRem from "../../../utils/pxToRem";

type Props = {
  children: ReactNode;
};

const Wrapper = styled.div`
  margin: 0 auto;
  /* max-width: ${(props) => props.theme.layout.innerWrapper}; */
  padding: 0 ${pxToRem(20)};
  position: relative;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    padding: 0 ${pxToRem(10)};
  }
`;

const LayoutWrapper = (props: Props) => (
  <Wrapper className="layout-wrapper">{props.children}</Wrapper>
);

export default LayoutWrapper;
