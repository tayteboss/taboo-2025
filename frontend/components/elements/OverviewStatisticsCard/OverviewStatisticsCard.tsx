import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";
import HoverTyper from "../HoverTyper";

const OverviewStatisticsCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${pxToRem(16)};
  grid-column: span 2;
`;

const Value = styled.div`
  color: var(--colour-background);
`;

const Description = styled.p`
  color: var(--colour-background);
  opacity: 0.5;
`;

type Props = {
  value: ProjectType["overviewStatistics"][number]["value"];
  description: ProjectType["overviewStatistics"][number]["description"];
};

const OverviewStatisticsCard = (props: Props) => {
  const { value, description } = props;
  return (
    <OverviewStatisticsCardWrapper>
      {value && (
        <Value className="type-p">
          <HoverTyper data={value} inView={true} />
        </Value>
      )}
      {description && (
        <Description className="type-mono-small">{description}</Description>
      )}
    </OverviewStatisticsCardWrapper>
  );
};

export default OverviewStatisticsCard;
