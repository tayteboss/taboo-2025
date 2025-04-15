import styled from "styled-components";
import client from "../../client";
import { motion } from "framer-motion";
import {
  ProjectType,
  TransitionsType,
  WorkPageType,
} from "../../shared/types/types";
import { NextSeo } from "next-seo";
import {
  simpleProjectsQueryString,
  workPageQueryString,
} from "../../lib/sanityQueries";
import pxToRem from "../../utils/pxToRem";
import PageBuilder from "../../components/common/PageBuilder";
import ProjectsList from "../../components/blocks/ProjectsList";
import FiltersBar from "../../components/blocks/FiltersBar";

const PageWrapper = styled(motion.div)`
  padding-top: var(--header-h);
  min-height: 150vh;
  padding-bottom: ${pxToRem(80)};
  background: var(--colour-white);
`;

type Props = {
  data: WorkPageType;
  projects: ProjectType[];
  pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
  const { data, projects, pageTransitionVariants } = props;

  console.log("projects", projects);

  return (
    <PageWrapper
      variants={pageTransitionVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <NextSeo
        title={data?.seoTitle || ""}
        description={data?.seoDescription || ""}
      />
      <FiltersBar />
      <ProjectsList />
    </PageWrapper>
  );
};

export async function getStaticProps() {
  const data = await client.fetch(workPageQueryString);
  const projects = await client.fetch(simpleProjectsQueryString);

  return {
    props: {
      data,
      projects,
    },
  };
}

export default Page;
