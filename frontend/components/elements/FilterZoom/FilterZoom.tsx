import styled from "styled-components";

const FilterZoomWrapper = styled.div`
  grid-column: span 2;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  white-space: pre;
`;

const Trigger = styled.button<{ $isInactive: boolean }>`
  opacity: ${(props) => (props.$isInactive ? "0.25" : "1")};
  pointer-events: ${(props) => (props.$isInactive ? "none" : "all")};

  transition: all var(--transition-speed-default) var(--transition-ease);

  &:hover {
    opacity: ${(props) => (props.$isInactive ? "0.25" : "0.5")};
  }
`;

type Props = {
  zoomLevel: number;
  setZoomLevel: (zoomLevel: number) => void;
};

const FilterZoom = (props: Props) => {
  const { zoomLevel, setZoomLevel } = props;
  return (
    <FilterZoomWrapper className="type-mono-small">
      Zoom{" "}
      <Trigger
        $isInactive={zoomLevel === 1}
        onClick={() => setZoomLevel(zoomLevel - 1)}
      >
        (-)
      </Trigger>
      <Trigger
        $isInactive={zoomLevel === 3}
        onClick={() => setZoomLevel(zoomLevel + 1)}
      >
        (+)
      </Trigger>
    </FilterZoomWrapper>
  );
};

export default FilterZoom;
