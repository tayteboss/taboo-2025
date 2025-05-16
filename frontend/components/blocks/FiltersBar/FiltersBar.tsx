import styled from "styled-components";
import LayoutWrapper from "../../layout/LayoutWrapper";
import LayoutGrid from "../../layout/LayoutGrid";
import FilterZoom from "../../elements/FilterZoom";
import FilterList from "../FilterList";
import pxToRem from "../../../utils/pxToRem";
import { CategoryType } from "../../../shared/types/types";

const FiltersBarWrapper = styled.section`
  padding: ${pxToRem(250)} 0 ${pxToRem(200)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    padding: ${pxToRem(200)} 0 ${pxToRem(50)};
  }

  .services-list {
    grid-column: span 4;
  }

  .view-types-list {
    grid-column: span 2;
  }
`;

const Title = styled.h1`
  grid-column: span 4;
`;

const DesktopInner = styled.div`
  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: none;
  }
`;

const MobileInner = styled.div`
  display: none;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: flex;
    justify-content: space-between;
  }
`;

const FiltersTrigger = styled.div`
  grid-column: span 2;
  text-align: right;

  span {
    text-decoration: underline;
  }
`;

type Props = {
  services: CategoryType[];
  viewTypes: CategoryType[];
  activeService: string;
  activeViewType: string;
  zoomLevel: number;
  setActiveService: (service: string) => void;
  setActiveViewType: (viewType: string) => void;
  setZoomLevel: (zoomLevel: number) => void;
  setFiltersModalIsActive: (value: boolean) => void;
};

const FiltersBar = (props: Props) => {
  const {
    services,
    viewTypes,
    activeService,
    activeViewType,
    zoomLevel,
    setActiveService,
    setActiveViewType,
    setZoomLevel,
    setFiltersModalIsActive,
  } = props;

  return (
    <FiltersBarWrapper>
      <LayoutWrapper>
        <DesktopInner>
          <LayoutGrid>
            <Title className="type-mono-small">Work</Title>
            <FilterList
              data={services}
              active={activeService}
              setActive={setActiveService}
              className="services-list"
            />
            <FilterList
              data={viewTypes}
              active={activeViewType}
              setActive={setActiveViewType}
              className="view-types-list"
            />
            <FilterZoom
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              isActive={activeViewType === "grid"}
            />
          </LayoutGrid>
        </DesktopInner>
        <MobileInner>
          <Title className="type-mono-small">Work</Title>
          <FiltersTrigger
            className="type-mono-small"
            onClick={() => setFiltersModalIsActive(true)}
          >
            <span>Filters</span>
          </FiltersTrigger>
        </MobileInner>
      </LayoutWrapper>
    </FiltersBarWrapper>
  );
};

export default FiltersBar;
