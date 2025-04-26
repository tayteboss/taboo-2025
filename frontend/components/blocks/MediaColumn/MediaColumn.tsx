import styled from "styled-components";
import MediaStack from "../../common/MediaStack";
import { ColumnType } from "../../../shared/types/types";
import { useInView } from "react-intersection-observer";

const MediaColumnWrapper = styled.div`
  overflow: hidden;
  border-radius: 15px;
`;

type Props = {
  data: ColumnType["media"];
};

const MediaColumn = (props: Props) => {
  const { data: oldMedia } = props;

  const media = {
    media: oldMedia,
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  return (
    <MediaColumnWrapper
      ref={ref}
      className={`view-element-fade-in ${
        inView ? "view-element-fade-in--in-view" : ""
      }`}
    >
      {media && <MediaStack data={media} />}
    </MediaColumnWrapper>
  );
};

export default MediaColumn;
