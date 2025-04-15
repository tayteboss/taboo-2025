import styled from "styled-components";

const FiltersBarWrapper = styled.section``;

type Props = {
  data: any;
};

const FiltersBar = (props: Props) => {
  const { data } = props;
  return <FiltersBarWrapper>FiltersBar</FiltersBarWrapper>;
};

export default FiltersBar;
