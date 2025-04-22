import styled from "styled-components";
import { MediaType, ProjectType } from "../../../shared/types/types";
import MediaStack from "../../common/MediaStack";
import { useEffect, useState } from "react";

const CanvasCardWrapper = styled.div`
  background: red;
`;

const MediaWrapper = styled.div``;

const MediaInner = styled.div<{ $ratio: string }>`
  width: 175px;
  height: 175px;

  .media-wrapper {
    padding-top: ${(props) => props.$ratio};
  }
`;

type Props = {
  id: string | number;
  description?: string;
  link?: string;
  media: MediaType;
  project: ProjectType;
  title: ProjectType["title"];
  year: ProjectType["year"];
  useProjectReference: boolean;
};

const CanvasCard = ({
  id,
  description,
  link,
  media,
  project,
  title,
  year,
  useProjectReference,
}: Props) => {
  // console.log("media", media);
  // console.log("project", project?.gridThumbnailMedia);

  const [mediaData, setMediaData] = useState("");
  const [ratio, setRatio] = useState("");

  useEffect(() => {
    const mediaData = useProjectReference ? project?.gridThumbnailMedia : media;
    const ratio = useProjectReference ? project?.gridThumbnailRatio : "100%";

    setMediaData(mediaData);
    setRatio(ratio);
  }, [useProjectReference, project, media]);

  console.log("mediaData", mediaData);
  console.log("project", project);

  return (
    <CanvasCardWrapper>
      <MediaWrapper>
        <MediaInner $ratio={ratio}>
          {media && <MediaStack data={mediaData} />}
        </MediaInner>
      </MediaWrapper>
    </CanvasCardWrapper>
  );
};

export default CanvasCard;
