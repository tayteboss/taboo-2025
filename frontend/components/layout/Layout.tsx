import styled from "styled-components";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { ReactNode, useEffect, useState } from "react";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import ContactModal from "../blocks/ContactModal";
import { SiteSettingsType } from "../../shared/types/types";

const siteSettings: SiteSettingsType = require("../../json/siteSettings.json");

const Main = styled.main``;

type Props = {
  children: ReactNode;
};

const Layout = (props: Props) => {
  const { children } = props;

  const [contactModalIsActive, setContactModalIsActive] = useState(false);

  const lenis = useLenis(({ scroll }) => {});

  useEffect(() => {
    if (!lenis) return;

    if (contactModalIsActive !== false) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [contactModalIsActive]);

  return (
    <>
      <Header setContactModalIsActive={setContactModalIsActive} />
      <ContactModal
        isActive={contactModalIsActive}
        setIsActive={setContactModalIsActive}
        siteSettings={siteSettings}
      />
      <ReactLenis root>
        <Main>{children}</Main>
      </ReactLenis>
      <Footer siteSettings={siteSettings} />
    </>
  );
};

export default Layout;
