import styled from "styled-components";
import client from "../../client";
import { ProjectType, TransitionsType } from "../../shared/types/types";
import { motion } from "framer-motion";
import { NextSeo } from "next-seo";
import PageBuilder from "../../components/common/PageBuilder";
import { projectListQueryString } from "../../lib/sanityQueries";
import ProjectTitle from "../../components/blocks/ProjectTitle";

type Props = {
  data: ProjectType;
  pageTransitionVariants: TransitionsType;
};

const PageWrapper = styled(motion.div)`
  min-height: 100vh;
`;

const Page = (props: Props) => {
  const {
    data: {
      title,
      slug,
      client,
      description,
      year,
      services,
      industries,
      gridThumbnailMedia,
      gridThumbnailRatio,
      pageBuilder,
      relatedProjects,
      heroMedia,
    },
    pageTransitionVariants,
  } = props;

  return (
    <PageWrapper
      variants={pageTransitionVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <NextSeo
        title={`${client?.title || ""} - ${title || ""} — Taboo`}
        description={`${description}`}
      />
      <ProjectTitle
        client={client?.title}
        title={title}
        services={services}
        year={year}
        heroMedia={heroMedia}
      />
      {/* <PageBuilder data={projects} /> */}
    </PageWrapper>
  );
};

export async function getStaticPaths() {
  const projectsQuery = `
		*[_type == 'project'] [0...100] {
			slug
		}
	`;

  const allProjects = await client.fetch(projectsQuery);

  return {
    paths: allProjects.map((item: any) => {
      return `/work/${item?.slug?.current}`;
    }),
    fallback: true,
  };
}

export async function getStaticProps({ params }: any) {
  const projectQuery = `
		*[_type == 'project' && slug.current == "${params.slug[0]}"][0] {
      ${projectListQueryString}
		}
	`;
  const data = await client.fetch(projectQuery);

  return {
    props: {
      data,
    },
  };
}

export default Page;
