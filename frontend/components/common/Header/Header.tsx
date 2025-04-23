import styled from "styled-components";
import LayoutWrapper from "../../layout/LayoutWrapper";
import Link from "next/link";
import pxToRem from "../../../utils/pxToRem";
import { motion } from "framer-motion";
import useActiveLink from "../../../hooks/useActiveLink";
import LogoIcon from "../../svgs/LogoIcon";
import Menu from "../../blocks/Menu";
import { useEffect, useState } from "react";
import throttle from "lodash/throttle";
import { useRouter } from "next/router";

const HeaderWrapper = styled.header`
  padding: ${pxToRem(20)} 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  mix-blend-mode: difference;
  pointer-events: none;

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
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${pxToRem(20)};
  pointer-events: all;

  a {
    position: relative;
  }
`;

const LinkTag = styled.div`
  cursor: pointer;
  color: var(--colour-white);

  transition: all var(--transition-speed-default) var(--transition-ease);

  &:hover {
    opacity: 0.5;
  }
`;

const Underline = styled(motion.div)`
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--colour-white);
`;

const LogoWrapper = styled.div<{
  $menuIsActive?: boolean;
  $hasScrolled?: boolean;
  $isActive?: boolean;
}>`
  position: relative;
  z-index: 2;
  pointer-events: all;
  opacity: ${(props) => (props.$isActive ? "1" : "0")};

  transition: all var(--transition-speed-default) var(--transition-ease);

  &:hover {
    opacity: ${(props) => (props.$menuIsActive ? "0.5" : "0.5")};
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
      width: ${(props) =>
        props.$menuIsActive
          ? "calc(100% - 20px)"
          : props.$hasScrolled
            ? "120px"
            : "100%"};
    }
  }
`;

type Props = {
  isActive: boolean;
  setContactModalIsActive: (value: boolean) => void;
};

const Header = (props: Props) => {
  const { isActive, setContactModalIsActive } = props;

  const [hasScrolled, setHasScrolled] = useState(false);
  const [menuIsActive, setMenuIsActive] = useState(false);

  const activeLink = useActiveLink();

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (window.scrollY > 100) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    }, 300);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
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
            <LogoWrapper $isActive={isActive}>
              <Link href="/">
                <LogoIcon />
              </Link>
            </LogoWrapper>
          </DesktopInner>
          <MobileInner>
            <LogoWrapper
              $menuIsActive={menuIsActive}
              $hasScrolled={hasScrolled}
              $isActive={isActive}
            >
              <Link href="/">
                <LogoIcon />
              </Link>
            </LogoWrapper>
          </MobileInner>
        </LayoutWrapper>
      </HeaderWrapper>
      <Menu
        activeLink={activeLink}
        menuIsActive={menuIsActive}
        setMenuIsActive={setMenuIsActive}
        setContactModalIsActive={setContactModalIsActive}
      />
    </>
  );
};

export default Header;
