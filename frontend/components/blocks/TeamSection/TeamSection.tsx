import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";

const TeamSectionWrapper = styled.section``;

type Props = {
  data: InformationPageType["teamSection"];
};

const TeamSection = (props: Props) => {
  const { data } = props;

  return <TeamSectionWrapper>TeamSection</TeamSectionWrapper>;
};

export default TeamSection;
