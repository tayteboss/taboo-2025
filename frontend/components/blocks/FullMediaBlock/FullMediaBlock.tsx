import styled from "styled-components";
import { MediaType } from "../../../shared/types/types";
import LayoutWrapper from "../../layout/LayoutWrapper";
import MediaStack from "../../common/MediaStack";
import pxToRem from "../../../utils/pxToRem";
import { useInView } from "react-intersection-observer";

const FullMediaBlockWrapper = styled.section``;

const MediaWrapper = styled.div<{ $ratio?: string }>`
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 15px;

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    border-radius: 10px;
  }

  .media-wrapper {
    padding-top: ${(props) => props.$ratio || "56.25%"};
  }
`;

const Caption = styled.div`
  position: absolute;
  bottom: ${pxToRem(20)};
  left: ${pxToRem(20)};
  background: var(--colour-background);
  color: var(--colour-foreground-alpha-50);
  padding: ${pxToRem(3)} ${pxToRem(6)} ${pxToRem(4)};
  border-radius: ${pxToRem(6)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    bottom: ${pxToRem(15)};
    left: ${pxToRem(15)};
  }
`;

type Props = {
  fullMedia: {
    ratio?: string;
    media: MediaType;
    caption?: string;
  };
};

const FullMediaBlock = (props: Props) => {
  const { fullMedia } = props;
  const { ratio, media: oldMedia, caption } = fullMedia;

  const media = {
    media: oldMedia,
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  return (
    <FullMediaBlockWrapper ref={ref}>
      <LayoutWrapper>
        <MediaWrapper
          className={`view-element-difference ${
            inView ? "view-element-difference--in-view" : ""
          }`}
          $ratio={ratio}
        >
          {media && (
            <MediaStack data={media} noAnimation sizes="100vw" lazyLoad />
          )}
          {caption && <Caption className="type-mono-small">{caption}</Caption>}
        </MediaWrapper>
      </LayoutWrapper>
    </FullMediaBlockWrapper>
  );
};

export default FullMediaBlock;
