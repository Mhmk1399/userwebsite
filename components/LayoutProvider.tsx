"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";
import { HeaderSection, FooterSection } from "@/lib/types";

interface LayoutProviderProps {
  children: React.ReactNode;
}

const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [headerData, setHeaderData] = useState<HeaderSection | null>(null);
  const [footerData, setFooterData] = useState<FooterSection | null>(null);
  const pathname = usePathname();

  const fetchLayoutData = async (routeName: string, activeMode: string) => {
    try {
      const response = await fetch("/api/layout-jason", {
        method: "GET",
        headers: {
          selectedRoute: routeName,
          activeMode: activeMode,
        },
      });

      if (!response.ok) {
        console.log(`Failed to fetch layout data: ${response.status}`);
        return null;
      }

      const layoutData = await response.json();

      if (layoutData.sections?.sectionHeader) {
        setHeaderData(layoutData.sections.sectionHeader);
      }

      if (layoutData.sections?.sectionFooter) {
        setFooterData(layoutData.sections.sectionFooter);
      }

      return layoutData;
    } catch (error) {
      console.error("Error fetching layout data:", error);
      return null;
    }
  };

  useEffect(() => {
    const handleResize = async () => {
      const isMobileView = window.innerWidth < 430;
      setIsMobile(isMobileView);

      const activeMode = isMobileView ? "sm" : "lg";

      // Determine route name based on pathname
      let routeName = "home";
      if (pathname === "/blogs") routeName = "blogs";
      else if (pathname === "/store") routeName = "store";
      else if (pathname === "/contact") routeName = "contact";
      else if (pathname === "/about") routeName = "about";

      await fetchLayoutData(routeName, activeMode);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
