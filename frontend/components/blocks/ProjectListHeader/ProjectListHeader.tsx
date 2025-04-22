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
  grid-column: span 4;
  color: var(--colour-foreground);
`;

const Industry = styled.p`
  grid-column: span 3;
  color: var(--colour-foreground);
`;

const Year = styled.p`
  grid-column: span 1;
  color: var(--colour-foreground);
  text-align: right;
`;

const ProjectListHeader = () => {
  return (
    <ProjectListHeaderWrapper>
      <LayoutGrid>
        <Client className="type-mono-small color-switch">Client</Client>
        <Service className="type-mono-small color-switch">Service</Service>
        <Industry className="type-mono-small color-switch">Industry</Industry>
        <Year className="type-mono-small color-switch">Year</Year>
      </LayoutGrid>
    </ProjectListHeaderWrapper>
  );
};

export default ProjectListHeader;
