import styled from "styled-components";
import FullMediaBlock from "../../blocks/FullMediaBlock";
import TwoColumnBlock from "../../blocks/TwoColumnBlock";
import StatisticBlock from "../../blocks/StatisticBlock";
import pxToRem from "../../../utils/pxToRem";

type Props = {
  data: any;
};

const PageBuilderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${pxToRem(20)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    gap: ${pxToRem(10)};
  }
`;

const PageBuilder = (props: Props) => {
  const { data } = props;

  const sections: any = {
    fullMedia: FullMediaBlock,
    twoColumn: TwoColumnBlock,
    statisticBlock: StatisticBlock,
  };

  return (
    <PageBuilderWrapper className="page-builder">
      {data &&
        data.map((section: any, i: number) => {
          {
            if (!sections[section.component]) {
              return (
                <div key={Math.random() * 10000}>
                  No section found for {section.component}
                </div>
              );
            } else {
              const Component = sections[section.component];
              return (
                <Component key={`${section.component}-${i}`} {...section} />
              );
            }
          }
        })}
    </PageBuilderWrapper>
  );
};

export default PageBuilder;
