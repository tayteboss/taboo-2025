import styled from "styled-components";

const ProjectTitleWrapper = styled.section``;

type Props = {
  data: any;
};

const ProjectTitle = (props: Props) => {
  const { data } = props;
  return <ProjectTitleWrapper>ProjectTitle</ProjectTitleWrapper>;
};

export default ProjectTitle;
