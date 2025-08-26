import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import LayoutWrapper from "../../layout/LayoutWrapper";
import LayoutGrid from "../../layout/LayoutGrid";
import ContentColumn from "../ContentColumn";
import MediaColumn from "../MediaColumn";
import StatisticColumn from "../StatisticColumn";
import pxToRem from "../../../utils/pxToRem";

const TwoColumnBlockWrapper = styled.section<{ $ratio?: string }>`
  .layout-grid {
    grid-row-gap: ${pxToRem(20)};

    @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
      grid-row-gap: ${pxToRem(10)};
    }
  }

  .media-wrapper,
  .column-ratio-wrapper {
    padding-top: ${(props) => props.$ratio || "100%"};
  }
`;

const Column = styled.div`
  grid-column: span 6;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    grid-column: 1 / -1;
  }
`;

type Props = {
  twoColumn: ProjectType["pageBuilder"][number]["twoColumn"];
};

const TwoColumnBlock = (props: Props) => {
  const { twoColumn } = props;
  const { ratio = "100%", leftColumn, rightColumn } = twoColumn;

  return (
    <TwoColumnBlockWrapper $ratio={ratio}>
      <LayoutWrapper>
        <LayoutGrid>
          <Column>
            {leftColumn?.blockType === "content" && (
              <ContentColumn data={leftColumn.contentBlock} />
            )}
            {leftColumn?.blockType === "statistic" && (
              <StatisticColumn data={leftColumn.statisticBlock} />
            )}
            {leftColumn?.blockType === "media" && (
              <MediaColumn data={leftColumn.media} />
            )}
          </Column>
          <Column>
            {rightColumn?.blockType === "content" && (
              <ContentColumn data={rightColumn.contentBlock} />
            )}
            {rightColumn?.blockType === "statistic" && (
              <StatisticColumn data={rightColumn.statisticBlock} />
            )}
            {rightColumn?.blockType === "media" && (
              <MediaColumn data={rightColumn.media} />
            )}
          </Column>
        </LayoutGrid>
      </LayoutWrapper>
    </TwoColumnBlockWrapper>
  );
};

export default TwoColumnBlock;
