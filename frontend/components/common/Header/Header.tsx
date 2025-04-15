import styled from "styled-components";
import LayoutWrapper from "../../layout/LayoutWrapper";
import Link from "next/link";
import pxToRem from "../../../utils/pxToRem";
import { motion } from "framer-motion";
import useActiveLink from "../../../hooks/useActiveLink";
import LogoIcon from "../../svgs/LogoIcon";
import Menu from "../../blocks/Menu";
import { useState } from "react";

const HeaderWrapper = styled.header`
  padding: ${pxToRem(20)} 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;

  @media ${(props) => props.theme.mediaBreakpoints.mobile} {
    padding: ${pxToRem(10)} 0;
  }
`;

const DesktopInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media ${(props) => props.theme.mediaBreakpoints.mobile} {
    display: none;
  }
`;

const MobileInner = styled.div`
  display: none;

  @media ${(props) => props.theme.mediaBreakpoints.mobile} {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100dvh - 20px);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${pxToRem(20)};

  a {
    position: relative;
  }
`;

const LinkTag = styled.div`
  transition: all var(--transition-speed-default) var(--transition-ease);

  &:hover {
    opacity: 0.5;
  }
`;

const Underline = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--colour-foreground);
`;

const LogoWrapper = styled.div<{ $menuIsActive?: boolean }>`
  position: relative;
  z-index: 2;

  transition: all var(--transition-speed-default) var(--transition-ease);

  &:hover {
    opacity: 0.5;
  }

  a {
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  svg {
    position: relative;
    width: ${pxToRem(140)};
    height: auto;
    margin: 0 auto;
    transform: ${(props) =>
      props.$menuIsActive ? "translateY(10px)" : "translateY(0)"};

    transition: all var(--transition-speed-slow) var(--transition-ease);

    @media ${(props) => props.theme.mediaBreakpoints.mobile} {
      width: ${(props) => (props.$menuIsActive ? "calc(100% - 20px)" : "100%")};
    }
  }
`;

type Props = {
  setContactModalIsActive: (value: boolean) => void;
};

const Header = (props: Props) => {
  const { setContactModalIsActive } = props;

  const activeLink = useActiveLink();

  const [menuIsActive, setMenuIsActive] = useState(false);

  return (
    <HeaderWrapper className="header">
      <LayoutWrapper>
        <DesktopInner>
          <NavLinks>
            <Link href="/">
              <LinkTag className="type-mono-small">Home</LinkTag>
              {activeLink === "Home" && (
                <Underline
                  layoutId="navlink-underline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </Link>
            <Link href="/work">
              <LinkTag className="type-mono-small">Work</LinkTag>
              {activeLink === "Work" && (
                <Underline
                  layoutId="navlink-underline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </Link>
            <Link href="/information">
              <LinkTag className="type-mono-small">Information</LinkTag>
              {activeLink === "Information" && (
                <Underline
                  layoutId="navlink-underline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </Link>
            <LinkTag
              className="type-mono-small"
              onClick={() => setContactModalIsActive(true)}
            >
              Contact
            </LinkTag>
          </NavLinks>
          <LogoWrapper>
            <Link href="/">
              <LogoIcon />
            </Link>
          </LogoWrapper>
        </DesktopInner>
        <MobileInner>
          <LogoWrapper $menuIsActive={menuIsActive}>
            <Link href="/">
              <LogoIcon />
            </Link>
          </LogoWrapper>
          <Menu
            activeLink={activeLink}
            menuIsActive={menuIsActive}
            setMenuIsActive={setMenuIsActive}
            setContactModalIsActive={setContactModalIsActive}
          />
        </MobileInner>
      </LayoutWrapper>
    </HeaderWrapper>
  );
};

export default Header;
