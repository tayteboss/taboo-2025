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
import ProjectsList from "../../components/blocks/ProjectsList";
import FiltersBar from "../../components/blocks/FiltersBar";
import { useEffect, useState } from "react";
import FiltersModal from "../../components/blocks/FiltersModal";

const services = [
  {
    title: "All",
    value: "all",
  },
  {
    title: "Service Type 1",
    value: "serviceType1",
  },
  {
    title: "Service Type 2",
    value: "serviceType2",
  },
  {
    title: "Service Type 3",
    value: "serviceType3",
  },
  {
    title: "Service Type 4",
    value: "serviceType4",
  },
];

const industries = [
  {
    title: "All",
    value: "all",
  },
  {
    title: "Industry Type 1",
    value: "industryType1",
  },
  {
    title: "Industry Type 2",
    value: "industryType2",
  },
  {
    title: "Industry Type 3",
    value: "industryType3",
  },
  {
    title: "Industry Type 4",
    value: "industryType4",
  },
  {
    title: "Industry Type 5",
    value: "industryType5",
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
  min-height: 100vh;
  padding-bottom: ${pxToRem(200)};
  background: var(--colour-background);
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
  const [filteredProjects, setFilteredProjects] = useState(projects);

  console.log("projects", projects);

  useEffect(() => {
    // Start with the full list and filter down
    const newFilteredProjects = projects.filter((project) => {
      // Check if the project matches the active service OR if the service filter is "all"
      const serviceMatch =
        activeService === "all" || project.service === activeService;

      // Check if the project matches the active industry OR if the industry filter is "all"
      const industryMatch =
        activeIndustry === "all" || project.industry === activeIndustry;

      // A project is included only if it matches both criteria (considering the "all" case)
      return serviceMatch && industryMatch;
    });

    setFilteredProjects(newFilteredProjects);

    // --- Important Dependency ---
    // Add `projects` to the dependency array.
    // If the source `projects` list itself changes (e.g., fetched from an API),
    // the filtering needs to re-run.
  }, [activeService, activeIndustry, projects]);

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
      <ProjectsList data={filteredProjects} zoomLevel={zoomLevel} />
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
