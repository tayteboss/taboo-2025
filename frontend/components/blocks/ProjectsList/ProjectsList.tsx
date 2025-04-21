import styled from "styled-components";
import LayoutWrapper from "../../layout/LayoutWrapper";
import LayoutGrid from "../../layout/LayoutGrid";
import { ProjectType } from "../../../shared/types/types";
import ProjectCard from "../ProjectCard";
import pxToRem from "../../../utils/pxToRem";

const ProjectsListWrapper = styled.section`
  .layout-grid {
    grid-row-gap: ${pxToRem(200)};
  }
`;

const Title = styled.h4`
  grid-column: 1 / -1;
`;

type Props = {
  data: ProjectType[];
  zoomLevel: number;
};

const ProjectsList = (props: Props) => {
  const { data, zoomLevel } = props;

  const hasData = data && data?.length > 0;

  return (
    <ProjectsListWrapper>
      <LayoutWrapper>
        <LayoutGrid>
          {hasData &&
            data.map((project, i) => (
              <ProjectCard {...project} zoomLevel={zoomLevel} key={i} />
            ))}
          {!hasData && <Title>No projects found...</Title>}
        </LayoutGrid>
      </LayoutWrapper>
    </ProjectsListWrapper>
  );
};

export default ProjectsList;
