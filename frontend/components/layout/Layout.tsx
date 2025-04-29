import styled from "styled-components";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { ReactNode, useEffect, useState } from "react";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import ContactModal from "../blocks/ContactModal";
import { SiteSettingsType } from "../../shared/types/types";
import { useRouter } from "next/router";

const siteSettings: SiteSettingsType = require("../../json/siteSettings.json");

const Main = styled.main``;

type Props = {
  children: ReactNode;
};

const Layout = (props: Props) => {
  const { children } = props;

  const [contactModalIsActive, setContactModalIsActive] = useState(false);
  const [headerIsActive, setHeaderIsActive] = useState(false);
  const [footerIsActive, setFooterIsActive] = useState(false);
  const router = useRouter();

  const lenis = useLenis(({ scroll }) => {});

  useEffect(() => {
    const isWorkSlugPage = router.pathname === "/work/[...slug]";
    const isHomePage = router.pathname === "/";

    setHeaderIsActive(!isHomePage);
    setFooterIsActive(!isHomePage);

    if (!isWorkSlugPage) {
      document.body.classList.remove("remove-footer");
    }
  }, [router]);

  useEffect(() => {
    if (!lenis) return;

    if (contactModalIsActive !== false || !headerIsActive) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [contactModalIsActive]);

  return (
    <>
      <Header
        setContactModalIsActive={setContactModalIsActive}
        isActive={headerIsActive}
      />
      <ContactModal
        isActive={contactModalIsActive}
        setIsActive={setContactModalIsActive}
        siteSettings={siteSettings}
      />
      <ReactLenis root>
        <Main>{children}</Main>
      </ReactLenis>
      <Footer siteSettings={siteSettings} isActive={footerIsActive} />
    </>
  );
};

export default Layout;
