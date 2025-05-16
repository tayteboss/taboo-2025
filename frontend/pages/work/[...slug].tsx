import styled from "styled-components";
import client from "../../client";
import { ProjectType } from "../../shared/types/types";
import { NextSeo } from "next-seo";
import {
  projectListQueryString,
  simpleProjectListQueryString,
} from "../../lib/sanityQueries";
import ProjectTitle from "../../components/blocks/ProjectTitle";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import PageBuilder from "../../components/common/PageBuilder";
import pxToRem from "../../utils/pxToRem";

const NextProject = dynamic(
  () => import("../../components/blocks/NextProject")
);

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--colour-background);
  margin-bottom: ${pxToRem(20)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    margin-bottom: ${pxToRem(10)};
  }
`;

type Props = {
  data: ProjectType;
};

const Page = (props: Props) => {
  const { data } = props;

  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
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
        heroMedia={data?.heroMedia}
        projectNumber={data?.projectIndex !== undefined ? data.projectIndex : 1}
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
    // First get the client to access its projects array
    const clientQuery = `
      *[_type == 'client' && title == $clientTitle][0] {
        "projects": projects[]-> {
          ${simpleProjectListQueryString}
        }
      }
    `;

    const clientResult = await client.fetch(clientQuery, {
      clientTitle: clientData.title,
    });

    if (clientResult?.projects?.length > 0) {
      const currentClientProjects = clientResult.projects;
      const currentProjectIndex = currentClientProjects.findIndex(
        (project: ProjectType) => project.slug.current === slug
      );

      if (currentProjectIndex !== -1) {
        // Add 1 to make index start at 1 instead of 0
        data.projectIndex = currentProjectIndex + 1;

        if (currentClientProjects.length > 1) {
          // Calculate next index, ensuring we loop back to 0 when we reach the end
          const nextIndex =
            (currentProjectIndex + 1) % currentClientProjects.length;
          nextProjectData = currentClientProjects[nextIndex];

          // Assign the correct index for the next project (starting at 1)
          if (nextProjectData) {
            nextProjectData.projectIndex = nextIndex + 1;
          }
        }
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
