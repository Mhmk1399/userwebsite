import useSWR from "swr";
import { HeaderSection, FooterSection } from "@/lib/types";

interface LayoutData {
  sections?: {
    sectionHeader?: HeaderSection;
    sectionFooter?: FooterSection;
  };
}

const fetcher = async ([routeName, activeMode]: [string, string]) => {
  const response = await fetch("/api/layout-jason", {
    method: "GET",
    headers: {
      selectedRoute: routeName,
      activeMode: activeMode,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch layout data: ${response.status}`);
  }

  return response.json();
};

export const useLayoutData = (routeName: string, activeMode: string) => {
  const { data, error, isLoading } = useSWR<LayoutData>(
    [routeName, activeMode],
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  return {
    headerData: data?.sections?.sectionHeader ?? null,
    footerData: data?.sections?.sectionFooter ?? null,
    isLoading,
    error,
  };
};
