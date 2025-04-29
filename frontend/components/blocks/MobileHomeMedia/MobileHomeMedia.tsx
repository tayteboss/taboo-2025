import styled from "styled-components";
import { HomePageType } from "../../../shared/types/types";
import MediaStack from "../../common/MediaStack";

const MobileHomeMediaWrapper = styled.section`
  display: none;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    height: 100lvh;
    overflow: hidden;
    transform-origin: center center;
    z-index: 2;

    .media-wrapper {
      height: 100vh;
      height: 100lvh;
      width: 100%;
    }
  }
`;

type Props = {
  data: HomePageType["mobileHeroMedia"];
};

const MobileHomeMedia = (props: Props) => {
  const { data } = props;
  return (
    <MobileHomeMediaWrapper>
      {data && <MediaStack data={data} />}
    </MobileHomeMediaWrapper>
  );
};

export default MobileHomeMedia;
