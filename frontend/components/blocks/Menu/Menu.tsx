import styled from "styled-components";
import Hamburger from "../../svgs/Hamburger/Hamburger";
import { AnimatePresence, motion } from "framer-motion";
import CrossSvg from "../../svgs/CrossIcon/CrossIcon";
import pxToRem from "../../../utils/pxToRem";
import Link from "next/link";

const MenuWrapper = styled.div`
  display: none;

  @media ${(props) => props.theme.mediaBreakpoints.mobile} {
    display: block;
    z-index: 90;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100dvh;
    pointer-events: none;
  }
`;

const MenuInner = styled(motion.div)`
  position: absolute;
  bottom: ${pxToRem(20)};
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 20px);
  margin: 0 auto;
  background: var(--colour-grey);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  border-radius: ${pxToRem(10)};
`;

const Trigger = styled.button`
  position: absolute;
  bottom: ${pxToRem(10)};
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 20px);
  z-index: 2;
  height: ${pxToRem(36)};
  background: var(--colour-grey);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${pxToRem(10)};
  pointer-events: all;

  svg {
    path {
      stroke: var(--colour-foreground);
    }
  }
`;

const NavLinks = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${pxToRem(20)};
  pointer-events: all;

  a {
    position: relative;
  }
`;

const LinkTag = styled.div`
  color: var(--colour-foreground);

  transition: all var(--transition-speed-default) var(--transition-ease);

  &.type-mono-small {
    font-size: ${pxToRem(24)};
    line-height: 1;
  }

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
  background: var(--colour-background);
`;

const wrapperVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const menuInnerVariants = {
  hidden: {
    height: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      when: "afterChildren",
    },
  },
  visible: {
    height: "calc(100dvh - 30px)",
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      delayChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

type Props = {
  activeLink: string;
  menuIsActive: boolean;
  setMenuIsActive: (value: boolean) => void;
  setContactModalIsActive: (value: boolean) => void;
};

const Menu = (props: Props) => {
  const { activeLink, menuIsActive, setMenuIsActive, setContactModalIsActive } =
    props;
  return (
    <MenuWrapper>
      <AnimatePresence>
        {menuIsActive && (
          <MenuInner
            variants={menuInnerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <NavLinks
              variants={childVariants}
              onClick={() => setMenuIsActive(false)}
            >
              <Link href="/">
                <LinkTag className="type-mono-small">Home</LinkTag>
              </Link>
              <Link href="/work">
                <LinkTag className="type-mono-small">Work</LinkTag>
              </Link>
              <Link href="/information">
                <LinkTag className="type-mono-small">Information</LinkTag>
              </Link>
              <LinkTag
                className="type-mono-small"
                onClick={() => {
                  setMenuIsActive(false);
                  setContactModalIsActive(true);
                }}
              >
                Contact
              </LinkTag>
            </NavLinks>
          </MenuInner>
        )}
      </AnimatePresence>
      <Trigger onClick={() => setMenuIsActive(!menuIsActive)}>
        <AnimatePresence mode="wait">
          {!menuIsActive ? (
            <motion.div
              variants={wrapperVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              key="hamburger"
            >
              <Hamburger />
            </motion.div>
          ) : (
            <motion.div
              variants={wrapperVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              key="cross"
            >
              <CrossSvg />
            </motion.div>
          )}
        </AnimatePresence>
      </Trigger>
    </MenuWrapper>
  );
};

export default Menu;
