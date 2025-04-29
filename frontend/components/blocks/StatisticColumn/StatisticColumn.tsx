import styled from "styled-components";
import { ColumnType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";
import { useInView } from "react-intersection-observer";

const StatisticColumnWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const Inner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${pxToRem(20)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    gap: ${pxToRem(10)};
  }
`;

const StatisticBlock = styled.div`
  flex: 1;
  background: var(--colour-grey);
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: ${pxToRem(15)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    border-radius: ${pxToRem(10)};
    gap: ${pxToRem(10)};
  }
`;

const Title = styled.p`
  color: var(--colour-black);
  text-align: center;
  margin: 0 auto;
  max-width: ${pxToRem(600)};
`;

const Description = styled.p`
  color: var(--colour-black);
  text-align: center;
  margin: 0 auto;
  max-width: ${pxToRem(600)};
`;

type Props = {
  data: ColumnType["statisticBlock"];
};

const StatisticColumn = (props: Props) => {
  const { data } = props;

  const hasData = data && data?.length > 0;

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  return (
    <StatisticColumnWrapper
      ref={ref}
      className={`column-ratio-wrapper view-element-fade-in ${
        inView ? "view-element-fade-in--in-view" : ""
      }`}
    >
      <Inner>
        {hasData &&
          data.map((item, i) => (
            <StatisticBlock key={`${item?.title || "stat-block"}-${i}`}>
              {item?.title && (
                <Title className="type-h2 color-switch">{item.title}</Title>
              )}
              {item?.description && (
                <Description className="type-mono-small color-switch">
                  {item.description}
                </Description>
              )}
            </StatisticBlock>
          ))}
      </Inner>
    </StatisticColumnWrapper>
  );
};

export default StatisticColumn;
