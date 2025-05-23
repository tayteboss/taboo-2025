import styled from "styled-components";

const FilterZoomWrapper = styled.div<{ $isActive: boolean }>`
  grid-column: span 2;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  white-space: pre;
  opacity: ${(props) => (props.$isActive ? "1" : "0.3")};
  pointer-events: ${(props) => (props.$isActive ? "all" : "none")};

  transition: all var(--transition-speed-default) var(--transition-ease);
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
  isActive: boolean;
  setZoomLevel: (zoomLevel: number) => void;
};

const FilterZoom = (props: Props) => {
  const { zoomLevel, isActive, setZoomLevel } = props;
  return (
    <FilterZoomWrapper className="type-mono-small" $isActive={isActive}>
      Zoom{" "}
      <Trigger
        $isInactive={zoomLevel === 1}
        onClick={() => setZoomLevel(zoomLevel - 1)}
        role="button"
        aria-label={`Zoom out`}
      >
        (-)
      </Trigger>
      <Trigger
        $isInactive={zoomLevel === 3}
        onClick={() => setZoomLevel(zoomLevel + 1)}
        role="button"
        aria-label={`Zoom in`}
      >
        (+)
      </Trigger>
    </FilterZoomWrapper>
  );
};

export default FilterZoom;
