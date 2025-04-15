import styled from "styled-components";

const ProjectsListWrapper = styled.section``;

type Props = {
  data: any;
};

const ProjectsList = (props: Props) => {
  const { data } = props;
  return <ProjectsListWrapper>ProjectsList</ProjectsListWrapper>;
};

export default ProjectsList;
