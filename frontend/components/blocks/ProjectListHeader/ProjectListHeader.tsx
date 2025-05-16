import styled from "styled-components";
import LayoutGrid from "../../layout/LayoutGrid";
import pxToRem from "../../../utils/pxToRem";

const ProjectListHeaderWrapper = styled.div`
  margin-bottom: ${pxToRem(20)};
`;

const Client = styled.p`
  grid-column: span 4;
  color: var(--colour-foreground);
`;

const Service = styled.p`
  grid-column: span 8;
  color: var(--colour-foreground);
`;

const ProjectListHeader = () => {
  return (
    <ProjectListHeaderWrapper>
      <LayoutGrid>
        <Client className="type-mono-small color-switch">Client</Client>
        <Service className="type-mono-small color-switch">Services</Service>
      </LayoutGrid>
    </ProjectListHeaderWrapper>
  );
};

export default ProjectListHeader;
