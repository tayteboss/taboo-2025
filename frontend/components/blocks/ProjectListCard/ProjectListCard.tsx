import styled from "styled-components";
import { ProjectType } from "../../../shared/types/types";
import LayoutGrid from "../../layout/LayoutGrid";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import HoverTyper from "../../elements/HoverTyper";
import { useState } from "react";

const ProjectListCardWrapper = styled.div`
  opacity: 0.25;

  transition: all var(--transition-speed-default) var(--transition-ease);

  &:hover {
    opacity: 1;

    * {
      cursor: pointer;
    }
  }
`;

const Client = styled.p`
  grid-column: span 4;
  color: var(--colour-foreground);
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;
  white-space: nowrap;
  position: relative;

  transition: all var(--transition-speed-default) var(--transition-ease);
`;

const ClientSpan = styled.span<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;
  color: var(--colour-foreground);
  opacity: ${(props) => (props.$isActive ? "0.5" : "0")};

  transition: all var(--transition-speed-default) var(--transition-ease);

  * {
    flex-wrap: nowrap;
  }

  &:after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 100%;
    background: linear-gradient(
      90deg,
      var(--colour-background-alpha-0) 0%,
      var(--colour-background) 100%
    );
  }
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
  text-align: right;
  color: var(--colour-foreground);

  * {
    text-align: right;
  }
`;

type Props = {
  title: ProjectType["title"];
  slug: ProjectType["slug"];
  client: ProjectType["client"];
  gridThumbnailMedia: ProjectType["gridThumbnailMedia"];
  gridThumbnailRatio: ProjectType["gridThumbnailRatio"];
  service: ProjectType["service"];
  industry: ProjectType["industry"];
  year: ProjectType["year"];
};

const ProjectListCard = (props: Props) => {
  const {
    title,
    slug,
    client,
    gridThumbnailMedia,
    gridThumbnailRatio,
    service,
    industry,
    year,
  } = props;

  const [isHovered, setIsHovered] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: "-50px",
  });

  return (
    <ProjectListCardWrapper
      ref={ref}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      <Link href={`/work/${slug.current}`}>
        <LayoutGrid>
          <Client className="type-p color-switch">
            {isHovered ? (
              <HoverTyper data={title || ""} inView={true} />
            ) : (
              <HoverTyper data={client?.title || ""} inView={true} />
            )}
          </Client>

          <Service className="type-p color-switch">
            <HoverTyper data={service || ""} inView={inView} />
          </Service>
          <Industry className="type-p color-switch">
            <HoverTyper data={industry || ""} inView={inView} />
          </Industry>
          <Year className="type-p color-switch">{year || ""}</Year>
        </LayoutGrid>
      </Link>
    </ProjectListCardWrapper>
  );
};

export default ProjectListCard;
