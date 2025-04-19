import styled from "styled-components";

const FilterListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ListItem = styled.button<{ $isActive: boolean }>`
  opacity: ${(props) => (props.$isActive ? "0.25" : "1")};

  transition: all var(--transition-speed-default) var(--transition-ease) !important;

  &:hover {
    opacity: ${(props) => (props.$isActive ? "0.25" : "0.5")};
  }
`;

type Props = {
  data: Array<{ title: string; value: string }>;
  active: string;
  className: string;
  setActive: (value: string) => void;
};

const FilterList = (props: Props) => {
  const { data, active, className, setActive } = props;
  return (
    <FilterListWrapper className={className}>
      {data.map((item) => (
        <ListItem
          $isActive={active === item.value}
          onClick={() => setActive(item.value)}
          key={item.value}
          className="type-mono-small color-switch"
        >
          ({active === item.value ? "•" : " "}) {item.title}
        </ListItem>
      ))}
    </FilterListWrapper>
  );
};

export default FilterList;
