import styled from "styled-components";
import { NextSeo } from "next-seo";
import { HomePageType, TransitionsType } from "../shared/types/types";
import { motion } from "framer-motion";
import client from "../client";
import { homePageQueryString } from "../lib/sanityQueries";
import HomeCanvas from "../components/blocks/HomeCanvas";
import { useEffect } from "react";
import MobileHomeCanvas from "../components/blocks/MobileHomeCanvas";
import MobileHomeMedia from "../components/blocks/MobileHomeMedia";
import pxToRem from "../utils/pxToRem";

const PageWrapper = styled(motion.div)`
  height: 100vh;
`;

const Title = styled.h1`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: var(--colour-background);
  z-index: 1;
  pointer-events: none;
`;

type Props = {
  data: HomePageType;
  items: HomePageType["items"];
  pageTransitionVariants: TransitionsType;
};

const Page = (props: Props) => {
  const { data, items, pageTransitionVariants } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      <Title>{data?.seoTitle || ""}</Title>
      <HomeCanvas data={items} />
      {/* <MobileHomeCanvas data={items} /> */}
      <MobileHomeMedia data={data?.mobileHeroMedia} />
    </PageWrapper>
  );
};

export async function getStaticProps() {
  const data = await client.fetch(homePageQueryString);
  let items = data?.items || [];
  items = items
    .map((value: any) => ({ value, sort: Math.random() }))
    .sort((a: any, b: any) => a.sort - b.sort)
    .map(({ value }: any) => value);

  return {
    props: {
      data,
      items,
    },
  };
}

export default Page;
