import styled from "styled-components";
import { useInView } from "react-intersection-observer";
import ImageComponent from "./ImageComponent";
import VideoComponent from "./VideoComponent";
import { MediaType } from "../../../shared/types/types";

const MediaStackWrapper = styled.div``;

type Props = {
  data: MediaType;
  isPriority?: boolean;
  noAnimation?: boolean;
  sizes?: undefined | string;
};

const MediaStack = (props: Props) => {
  const {
    data,
    isPriority = false,
    noAnimation = false,
    sizes = undefined,
  } = props ?? {};

  const useVideo = data?.media?.mediaType === "video";

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: "-5%",
  });

  console.log("dataaaa", data);

  return (
    <MediaStackWrapper ref={ref}>
      {useVideo && (
        <VideoComponent
          data={data}
          inView={inView}
          isPriority={isPriority}
          noAnimation={noAnimation}
        />
      )}
      {!useVideo && (
        <ImageComponent
          data={data}
          isPriority={isPriority}
          inView={inView}
          noAnimation={noAnimation}
          sizes={sizes}
        />
      )}
    </MediaStackWrapper>
  );
};

export default MediaStack;
