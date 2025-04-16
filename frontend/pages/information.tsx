import styled from "styled-components";
import { NextSeo } from "next-seo";
import {
  InformationPageType,
  SiteSettingsType,
  TransitionsType,
} from "../shared/types/types";
import { motion } from "framer-motion";
import client from "../client";
import {
  informationPageQueryString,
  siteSettingsQueryString,
} from "../lib/sanityQueries";
import AboutSection from "../components/blocks/AboutSection";
import AchievementsSection from "../components/blocks/AchievementsSection";
import ClientLogosSection from "../components/blocks/ClientLogosSection";
import HowWeDoItSection from "../components/blocks/HowWeDoItSection";
import PrinciplesSection from "../components/blocks/PrinciplesSection";
import StatisticSection from "../components/blocks/StatisticSection";
import TeamSection from "../components/blocks/TeamSection";
import pxToRem from "../utils/pxToRem";

const PageWrapper = styled(motion.div)`
  padding-top: ${pxToRem(240)};

  @media ${(props) => props.theme.mediaBreakpoints.tabletPortrait} {
    padding-top: ${pxToRem(200)};
  }
`;

type Props = {
  data: InformationPageType;
  siteSettings: SiteSettingsType;
  pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
  const { data, siteSettings, pageTransitionVariants } = props;

  console.log("data", data);

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
      <AboutSection data={data?.aboutUsSection} />
      <StatisticSection data={data?.statisticsSection} />
      <PrinciplesSection data={data?.principlesSection} />
      <AchievementsSection data={data?.achievementsSection} />
      <TeamSection data={data?.teamSection} />
      <HowWeDoItSection data={data?.howDoWeDoItSection} />
      <ClientLogosSection data={data?.featuredClientLogosSection} />
    </PageWrapper>
  );
};

export async function getStaticProps() {
  const siteSettings = await client.fetch(siteSettingsQueryString);
  const data = await client.fetch(informationPageQueryString);

  return {
    props: {
      data,
      siteSettings,
    },
  };
}

export default Page;
