import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const useActiveLink = (): string => {
  const [activeLink, setActiveLink] = useState<string>("Home");
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === "/") {
      setActiveLink("Home");
    } else if (router.pathname === "/about") {
      setActiveLink("About");
    } else if (
      router.pathname === "/work" ||
      router.pathname === "/work/[slug]"
    ) {
      setActiveLink("Work");
    } else {
      setActiveLink("");
    }
  }, [router]);

  return activeLink;
};

export default useActiveLink;
