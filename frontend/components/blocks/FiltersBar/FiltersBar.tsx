import styled from "styled-components";
import LayoutWrapper from "../../layout/LayoutWrapper";
import LayoutGrid from "../../layout/LayoutGrid";
import FilterZoom from "../../elements/FilterZoom";
import FilterList from "../FilterList";
import pxToRem from "../../../utils/pxToRem";

const FiltersBarWrapper = styled.section`
  padding: ${pxToRem(200)} 0;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    padding: ${pxToRem(100)} 0;
  }

  .services-list,
  .industries-list {
    grid-column: span 4;
  }

  .view-types-list {
    grid-column: span 2;
  }
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

const Title = styled.h1``;

const FiltersTrigger = styled.div`
  grid-column: span 2;
  text-align: right;

  span {
    text-decoration: underline;
  }
`;

type Props = {
  services: Array<{ title: string; value: string }>;
  industries: Array<{ title: string; value: string }>;
  viewTypes: Array<{ title: string; value: string }>;
  activeService: string;
  activeIndustry: string;
  activeViewType: string;
  zoomLevel: number;
  setActiveService: (service: string) => void;
  setActiveIndustry: (industry: string) => void;
  setActiveViewType: (viewType: string) => void;
  setZoomLevel: (zoomLevel: number) => void;
  setFiltersModalIsActive: (value: boolean) => void;
};

const FiltersBar = (props: Props) => {
  const {
    services,
    industries,
    viewTypes,
    activeService,
    activeIndustry,
    activeViewType,
    zoomLevel,
    setActiveService,
    setActiveIndustry,
    setActiveViewType,
    setZoomLevel,
    setFiltersModalIsActive,
  } = props;

  return (
    <FiltersBarWrapper>
      <LayoutWrapper>
        <DesktopInner>
          <LayoutGrid>
            <FilterList
              data={services}
              active={activeService}
              setActive={setActiveService}
              className="services-list"
            />
            <FilterList
              data={industries}
              active={activeIndustry}
              setActive={setActiveIndustry}
              className="industries-list"
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
            <span>Filters</span> (NA)
          </FiltersTrigger>
        </MobileInner>
      </LayoutWrapper>
    </FiltersBarWrapper>
  );
};

export default FiltersBar;
