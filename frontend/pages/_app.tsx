// _app.js

import { useEffect, useState, useRef } from "react";
import "../styles/fonts.css";
import { ThemeProvider } from "styled-components";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "../components/layout";
import { theme } from "../styles/theme";
import { GlobalStyles } from "../styles/global";
import use1vh from "../hooks/use1vh";
import useHeaderHeight from "../hooks/useHeaderHeight";
import Cursor from "../components/elements/Cursor";

// --- Define Transition Variants ---

// Variants for standard page transitions (fade)
const pageTransitionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, delay: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Variants for INSTANT swap between work slugs
const noTransitionVariants = {
  initial: { opacity: 1, transition: { duration: 0 } }, // Explicit zero duration
  animate: { opacity: 1, transition: { duration: 0 } }, // Explicit zero duration
  exit: { opacity: 1, transition: { duration: 0 } }, // Explicit zero duration & stay opaque
};

type Props = {
  Component: React.ElementType;
  pageProps: any;
};

const App = (props: Props) => {
  const { Component, pageProps } = props;
  const [appCursorRefresh, setAppCursorRefresh] = useState(0);
  const router = useRouter();
  const previousPathRef = useRef<string | null>(null);

  // Function to check navigation type
  const isNavigatingBetweenWorkSlugs = (
    prevPath: string | null,
    currentPath: string
  ): boolean => {
    // Ensure both paths exist, start with /work/, and are different
    return (
      !!prevPath &&
      prevPath.startsWith("/work/") &&
      currentPath.startsWith("/work/")
    );
  };

  const handleExitComplete = (): void => {
    // Scroll to top ONLY if NOT navigating between work slugs
    if (!isNavigatingBetweenWorkSlugs(previousPathRef.current, router.asPath)) {
      window.scrollTo(0, 0);
    }
    // Note: If using mode="sync", onExitComplete might behave differently or fire earlier
    // than with "wait". Test if scroll behavior is still correct.
  };

  use1vh();
  useHeaderHeight();

  useEffect(() => {
    previousPathRef.current = router.asPath;
  }, [router.asPath]);

  useEffect(() => {
    setAppCursorRefresh((prev) => prev + 1);

    const body = document.querySelector("body");
    if (body) {
      if (router?.pathname === "/404") {
        body.classList.add("modal-open");
      } else {
        body.classList.remove("modal-open");
      }
      body.classList.remove("fade-pagebuilder-modules");
    }

    const timer = setTimeout(() => {
      setAppCursorRefresh((prev) => prev + 1);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [router.asPath, router?.pathname]);

  // Determine transition type
  const navigatingBetweenWork = isNavigatingBetweenWorkSlugs(
    previousPathRef.current,
    router.asPath
  );

  const variantsToUse = navigatingBetweenWork
    ? noTransitionVariants
    : pageTransitionVariants;

  // --- Select AnimatePresence Mode ---
  // Use 'sync' for the instant swap between work slugs
  // Use 'wait' for standard fade transitions elsewhere
  const animationMode = navigatingBetweenWork ? "sync" : "wait";

  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={theme}>
        <Layout>
          <AnimatePresence
            mode={animationMode} // Use 'sync' for instant swap, 'wait' otherwise
            onExitComplete={handleExitComplete}
          >
            <motion.div
              key={router.asPath} // Essential for AnimatePresence
              variants={variantsToUse} // Apply the selected variants
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </Layout>
        <Cursor
          cursorRefresh={() => setAppCursorRefresh((prev) => prev + 1)}
          appCursorRefresh={appCursorRefresh}
        />
      </ThemeProvider>
    </>
  );
};

export default App;
