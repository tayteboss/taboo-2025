import styled from "styled-components";
import client from "../../client";
import { ProjectType } from "../../shared/types/types";
import { NextSeo } from "next-seo";
import PageBuilder from "../../components/common/PageBuilder";
import {
  projectListQueryString,
  simpleProjectListQueryString,
} from "../../lib/sanityQueries";
import ProjectTitle from "../../components/blocks/ProjectTitle";
import NextProject from "../../components/blocks/NextProject";
import { useEffect } from "react";

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--colour-background);
`;

type Props = {
  data: ProjectType;
};

const Page = (props: Props) => {
  const { data } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const body = document.querySelector("body");
    if (!body) return;
    if (!data?.nextProject) {
      body.classList.remove("remove-footer");
    } else {
      body.classList.add("remove-footer");
    }
  }, [data?.nextProject]);

  return (
    <PageContainer>
      <NextSeo
        title={`${data?.client?.title || ""} - ${data?.title || ""} — Taboo`}
        description={`${data?.overviewDescription || ""}`}
      />
      <ProjectTitle
        client={data?.client?.title}
        title={data?.title}
        services={data?.services}
        year={data?.year}
        heroMedia={data?.heroMedia}
        projectNumber={
          data?.projectIndex !== undefined ? data.projectIndex + 1 : 0
        }
      />
      <PageBuilder data={data?.pageBuilder} />
      {data?.nextProject && <NextProject data={data?.nextProject} />}
    </PageContainer>
  );
};

export async function getStaticPaths() {
  const projectsQuery = `
    *[_type == 'project'] [0...100] {
      "slug": slug.current
    }
  `;

  const allProjects = await client.fetch(projectsQuery);

  return {
    paths: allProjects.map((project: { slug: string }) => ({
      params: { slug: [project.slug] },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps({
  params,
}: {
  params: { slug: string[] | string };
}) {
  // Adjust type for flexibility
  // Handle potential string vs array (though dynamic routes usually give array)
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  if (!slug) {
    return { notFound: true }; // Handle case where slug is missing
  }

  const projectQuery = `
    *[_type == 'project' && slug.current == $slug][0] {
      ${projectListQueryString}
    }
  `;

  // Use parameters in fetch for security and clarity
  const data = await client.fetch(projectQuery, { slug });

  // --- Handle Not Found ---
  if (!data) {
    // console.warn(`Project with slug "${slug}" not found`); // Log for debugging
    return { notFound: true }; // Return 404 page
  }

  // Fetch client projects only if client exists
  const clientData = data.client;
  let nextProjectData = null;

  if (clientData?.title) {
    const clientProjectsQuery = `
        *[_type == 'client' && title == $clientTitle][0] {
          "projects": projects[]-> {
            ${simpleProjectListQueryString}
          }
        }
      `;
    const clientProjectsResult = await client.fetch(clientProjectsQuery, {
      clientTitle: clientData.title,
    });

    if (clientProjectsResult?.projects) {
      const currentClientProjects = clientProjectsResult.projects;
      const currentProjectIndex = currentClientProjects.findIndex(
        (project: ProjectType) => project.slug.current === slug
      );

      if (currentProjectIndex !== -1) {
        data.projectIndex = currentProjectIndex;

        if (currentClientProjects.length > 1) {
          const nextIndex =
            (currentProjectIndex + 1) % currentClientProjects.length; // Loop back to start
          nextProjectData = currentClientProjects[nextIndex];
          // Assign the correct index for the *next* project relative to the client list
          if (nextProjectData) {
            nextProjectData.projectIndex = nextIndex;
          }
        }
        // If only one project, nextProject remains null
      }
    }
  }

  // Assign the determined next project (or null) to the main data object
  data.nextProject = nextProjectData;

  return {
    props: {
      data,
    },
    // Optional: Add revalidate time if using ISR
    // revalidate: 60, // Re-generate page every 60 seconds
  };
}

export default Page;
