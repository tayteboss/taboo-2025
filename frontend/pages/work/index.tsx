import styled from "styled-components";
import client from "../../client";
import { motion } from "framer-motion";
import {
  CategoryType,
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
import dynamic from "next/dynamic";

const FiltersModal = dynamic(
  () => import("../../components/blocks/FiltersModal")
);

const viewTypes: any = [
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
  min-height: 100vh;
  padding-bottom: ${pxToRem(200)};
  background: var(--colour-background);
`;

type Props = {
  data: WorkPageType;
  projects: ProjectType[];
  services: CategoryType[];
  pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
  const { data, projects, services, pageTransitionVariants } = props;

  const [activeService, setActiveService] = useState("all");
  const [activeViewType, setActiveViewType] = useState("grid");
  const [zoomLevel, setZoomLevel] = useState(3);
  const [filtersModalIsActive, setFiltersModalIsActive] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    const newFilteredProjects = projects.filter((project) => {
      const serviceMatch =
        activeService === "all" || project.services.includes(activeService);
      return serviceMatch;
    });

    setFilteredProjects(newFilteredProjects);
  }, [activeService, projects]);

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
        viewTypes={viewTypes}
        activeService={activeService}
        activeViewType={activeViewType}
        zoomLevel={zoomLevel}
        setActiveService={setActiveService}
        setActiveViewType={setActiveViewType}
        setZoomLevel={setZoomLevel}
        setFiltersModalIsActive={setFiltersModalIsActive}
      />
      <FiltersModal
        isActive={filtersModalIsActive}
        services={services}
        activeService={activeService}
        setIsActive={setFiltersModalIsActive}
        setActiveService={setActiveService}
      />
      <ProjectsList
        data={filteredProjects}
        zoomLevel={zoomLevel}
        activeViewType={activeViewType}
        activeService={activeService}
      />
    </PageWrapper>
  );
};

export async function getStaticProps() {
  const data = await client.fetch(workPageQueryString);
  const projects = await client.fetch(simpleProjectsQueryString);

  const services: CategoryType[] = [
    {
      title: "All",
      value: "all",
      count: projects.length,
    },
  ];

  // Create a map to track service counts
  const serviceCounts = new Map<string, number>();

  projects.forEach((project: ProjectType) => {
    if (project.services && project.services.length > 0) {
      project.services.forEach((serviceValue) => {
        if (serviceValue) {
          serviceCounts.set(
            serviceValue,
            (serviceCounts.get(serviceValue) || 0) + 1
          );
        }
      });
    }
  });

  // Convert the map to service categories
  serviceCounts.forEach((count, serviceValue) => {
    services.push({
      title: serviceValue,
      value: serviceValue,
      count,
    });
  });

  return {
    props: {
      data,
      projects,
      services,
    },
  };
}

export default Page;
