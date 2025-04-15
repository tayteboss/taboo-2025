import styled from "styled-components";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { ReactNode, useState } from "react";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";

const Main = styled.main``;

type Props = {
  children: ReactNode;
};

const Layout = (props: Props) => {
  const { children } = props;

  const [contactModalIsActive, setContactModalIsActive] = useState(false);

  const lenis = useLenis(({ scroll }) => {});

  return (
    <>
      <Header setContactModalIsActive={setContactModalIsActive} />
      <ReactLenis root>
        <Main>{children}</Main>
      </ReactLenis>
      <Footer />
    </>
  );
};

export default Layout;
