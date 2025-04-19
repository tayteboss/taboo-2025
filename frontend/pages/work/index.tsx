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
import { useState } from "react";
import FiltersModal from "../../components/blocks/FiltersModal";

const services = [
  {
    title: "All",
    value: "all",
  },
  {
    title: "Foresight",
    value: "foresight",
  },
  {
    title: "Design",
    value: "design",
  },
  {
    title: "Communications",
    value: "comms",
  },
  {
    title: "Experiences",
    value: "experiences",
  },
];

const industries = [
  {
    title: "All",
    value: "all",
  },
  {
    title: "Fashion",
    value: "fashion",
  },
  {
    title: "Technology",
    value: "technology",
  },
  {
    title: "Sustainability",
    value: "sustainability",
  },
  {
    title: "Art",
    value: "art",
  },
  {
    title: "Architecture",
    value: "architecture",
  },
  {
    title: "Design",
    value: "design",
  },
  {
    title: "Sport",
    value: "sport",
  },
];

const viewTypes = [
  {
    title: "Grid",
    value: "grid",
  },
  {
    title: "List",
    value: "list",
  },
];

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

  const [activeService, setActiveService] = useState("all");
  const [activeIndustry, setActiveIndustry] = useState("all");
  const [activeViewType, setActiveViewType] = useState("grid");
  const [zoomLevel, setZoomLevel] = useState(3);
  const [filtersModalIsActive, setFiltersModalIsActive] = useState(false);

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
      <FiltersBar
        services={services}
        industries={industries}
        viewTypes={viewTypes}
        activeService={activeService}
        activeIndustry={activeIndustry}
        activeViewType={activeViewType}
        zoomLevel={zoomLevel}
        setActiveService={setActiveService}
        setActiveIndustry={setActiveIndustry}
        setActiveViewType={setActiveViewType}
        setZoomLevel={setZoomLevel}
        setFiltersModalIsActive={setFiltersModalIsActive}
      />
      <FiltersModal
        isActive={filtersModalIsActive}
        services={services}
        industries={industries}
        activeService={activeService}
        activeIndustry={activeIndustry}
        setIsActive={setFiltersModalIsActive}
        setActiveService={setActiveService}
        setActiveIndustry={setActiveIndustry}
      />
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
