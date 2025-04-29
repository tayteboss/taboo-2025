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
import FiltersModal from "../../components/blocks/FiltersModal";

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
  padding-top: var(--header-h);
  min-height: 100vh;
  padding-bottom: ${pxToRem(200)};
  background: var(--colour-background);
`;

type Props = {
  data: WorkPageType;
  projects: ProjectType[];
  services: CategoryType[];
  industries: CategoryType[];
  pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
  const { data, projects, services, industries, pageTransitionVariants } =
    props;

  const [activeService, setActiveService] = useState("all");
  const [activeIndustry, setActiveIndustry] = useState("all");
  const [activeViewType, setActiveViewType] = useState("grid");
  const [zoomLevel, setZoomLevel] = useState(3);
  const [filtersModalIsActive, setFiltersModalIsActive] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    const newFilteredProjects = projects.filter((project) => {
      const serviceMatch =
        activeService === "all" || project.services === activeService;
      const industryMatch =
        activeIndustry === "all" || project.industries === activeIndustry;
      return serviceMatch && industryMatch;
    });

    setFilteredProjects(newFilteredProjects);
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
      <ProjectsList
        data={filteredProjects}
        zoomLevel={zoomLevel}
        activeViewType={activeViewType}
        activeService={activeService}
        activeIndustry={activeIndustry}
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

  const industries: CategoryType[] = [
    {
      title: "All",
      value: "all",
      count: projects.length,
    },
  ];

  projects.forEach((project: ProjectType) => {
    const serviceValue = project.services;
    if (serviceValue) {
      const service = services.find(
        (service) => service.value === serviceValue
      );
      if (!service) {
        services.push({
          title: serviceValue,
          value: serviceValue,
          count: 1,
        });
      } else {
        service.count += 1;
      }
    }

    const industryValue = project.industries;
    if (industryValue) {
      const industry = industries.find(
        (industry) => industry.value === industryValue
      );
      if (!industry) {
        industries.push({
          title: industryValue,
          value: industryValue,
          count: 1,
        });
      } else {
        industry.count += 1;
      }
    }
  });

  return {
    props: {
      data,
      projects,
      services,
      industries,
    },
  };
}

export default Page;
