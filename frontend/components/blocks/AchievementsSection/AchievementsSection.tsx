import styled from "styled-components";
import { InformationPageType } from "../../../shared/types/types";

const AchievementsSectionWrapper = styled.section`
  height: 50vh;
`;

type Props = {
  data: InformationPageType["achievementsSection"];
};

const AchievementsSection = (props: Props) => {
  const { data } = props;

  return (
    <AchievementsSectionWrapper>AchievementsSection</AchievementsSectionWrapper>
  );
};

export default AchievementsSection;
