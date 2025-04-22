import styled from "styled-components";
import HoverTyper from "../../elements/HoverTyper";
import { useInView } from "react-intersection-observer";
import pxToRem from "../../../utils/pxToRem";
import { CategoryType } from "../../../shared/types/types";

const FilterListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ListItem = styled.button<{ $isActive: boolean }>`
  opacity: ${(props) => (props.$isActive ? "0.25" : "1")};
  display: flex;
  align-items: center;
  gap: ${pxToRem(4)};

  transition: all var(--transition-speed-default) var(--transition-ease) !important;

  &:hover {
    opacity: ${(props) => (props.$isActive ? "0.25" : "0.5")};
  }

  * {
    cursor: pointer;
  }
`;

type Props = {
  data: CategoryType[];
  active: string;
  className: string;
  setActive: (value: string) => void;
};

const FilterList = (props: Props) => {
  const { data, active, className, setActive } = props;

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  const isCategoryType =
    className === "industries-list" || className === "services-list";

  return (
    <FilterListWrapper className={className} ref={ref}>
      {data.map((item) => (
        <ListItem
          $isActive={active === item.value}
          onClick={() => setActive(item.value)}
          key={item.value}
          className="type-mono-small color-switch"
        >
          ({active === item.value ? "•" : " "}){" "}
          <HoverTyper
            data={`${item.title} ${isCategoryType ? `(${item?.count})` : ""}`}
            inView={inView}
          />
        </ListItem>
      ))}
    </FilterListWrapper>
  );
};

export default FilterList;
