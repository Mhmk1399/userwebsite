"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";
import { useLayoutData } from "@/hook/useLayoutData";

interface LayoutProviderProps {
  children: React.ReactNode;
}

const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [routeName, setRouteName] = useState("home");
  const [activeMode, setActiveMode] = useState("lg");
  const pathname = usePathname();

  const { headerData, footerData } = useLayoutData(routeName, activeMode);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 430;
      setIsMobile(isMobileView);
      setActiveMode(isMobileView ? "sm" : "lg");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let route = "home";
    if (pathname === "/blogs") route = "blogs";
    else if (pathname === "/store") route = "store";
    else if (pathname === "/contact") route = "contact";
    else if (pathname === "/about") route = "about";
    setRouteName(route);
  }, [pathname]);

  if (
    pathname === "/login" ||
    pathname === "/cart" ||
    pathname === "/dashboard"
  ) {
    return (
      <>
        <main>{children}</main>
      </>
    );
  }

  return (
    <>
      <Header isMobile={isMobile} headerData={headerData ?? undefined} />
      <main>{children}</main>
      <Footer footerData={footerData ?? undefined} />
    </>
  );
};

export default LayoutProvider;
