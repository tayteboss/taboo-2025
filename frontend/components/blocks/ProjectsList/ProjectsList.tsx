import styled from "styled-components";
import LayoutWrapper from "../../layout/LayoutWrapper";
import LayoutGrid from "../../layout/LayoutGrid";
import { ProjectType } from "../../../shared/types/types";
import pxToRem from "../../../utils/pxToRem";
import ProjectGridCard from "../ProjectGridCard";
import ProjectListHeader from "../ProjectListHeader";
import ProjectListCard from "../ProjectListCard";
import { AnimatePresence, motion } from "framer-motion";

const ProjectsListWrapper = styled.section`
  .layout-grid {
    grid-row-gap: ${pxToRem(200)};

    @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
      grid-row-gap: ${pxToRem(50)};
    }
  }
`;

const Title = styled(motion.h4)`
  grid-column: 1 / -1;
`;

const GridWrapper = styled(motion.div)``;

const ListWrapper = styled(motion.div)``;

const wrapperVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

type Props = {
  data: ProjectType[];
  zoomLevel: number;
  activeViewType: string;
};

const ProjectsList = (props: Props) => {
  const { data, activeViewType, zoomLevel } = props;

  const hasData = data && data?.length > 0;

  return (
    <ProjectsListWrapper>
      <LayoutWrapper>
        <AnimatePresence mode="wait">
          {!hasData && (
            <Title
              initial="hidden"
              animate="visible"
              exit="hidden"
              key="title-wrapper"
            >
              No projects found...
            </Title>
          )}
          {activeViewType === "grid" && hasData && (
            <GridWrapper
              variants={wrapperVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              key="grid-wrapper"
            >
              <LayoutGrid>
                {data.map((project, i) => (
                  <ProjectGridCard {...project} zoomLevel={zoomLevel} key={i} />
                ))}
              </LayoutGrid>
            </GridWrapper>
          )}
          {activeViewType === "list" && hasData && (
            <ListWrapper
              variants={wrapperVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              key="list-wrapper"
            >
              <ProjectListHeader />
              {data.map((project, i) => (
                <ProjectListCard {...project} key={i} />
              ))}
            </ListWrapper>
          )}
        </AnimatePresence>
      </LayoutWrapper>
    </ProjectsListWrapper>
  );
};

export default ProjectsList;
