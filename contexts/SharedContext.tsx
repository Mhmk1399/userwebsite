"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Layout } from "@/lib/types";
import nullJson from "@/public/template/homelg.json";

// Define the context types for frequently shared props
interface SharedContextType {
  // Core layout and component management
  layout: Layout;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
  selectedComponent: string;
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;

  // Component ordering
  orders: string[];
  setOrders: React.Dispatch<React.SetStateAction<string[]>>;

  // UI state management
  isFormOpen: boolean;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  previewWidth: "sm" | "default";
  setPreviewWidth: (width: "sm" | "default") => void;

  // Active routes
  activeRoutes: string[];
  setActiveRoutes: React.Dispatch<React.SetStateAction<string[]>>;
}

// Create the context
const SharedContext = createContext<SharedContextType | undefined>(undefined);

// Provider component
interface SharedProviderProps {
  children: ReactNode;
}

export const SharedProvider: React.FC<SharedProviderProps> = ({ children }) => {
  // Core layout and component management
  const [layout, setLayout] = useState<Layout>(nullJson as unknown as Layout);
  const [selectedComponent, setSelectedComponent] = useState<string>("");

  // Component ordering
  const [orders, setOrders] = useState<string[]>([]);

  // UI state management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [previewWidth, setPreviewWidth] = useState<"sm" | "default">("sm");

  // Active routes
  const [activeRoutes, setActiveRoutes] = useState([
    "home",
    "about",
    "contact",
    "store",
    "BlogList",
    "BlogDetail",
    "DetailPage",
  ]);

  // Initialize orders from layout
  useEffect(() => {
    setOrders([...layout.sections.children.order]);
  }, [layout.sections.children.order]);

  const contextValue: SharedContextType = {
    // Core layout and component management
    layout,
    setLayout,
    selectedComponent,
    setSelectedComponent,

    // Component ordering
    orders,
    setOrders,

    // UI state management
    isFormOpen,
    setIsFormOpen,
    previewWidth,
    setPreviewWidth,

    // Active routes
    activeRoutes,
    setActiveRoutes,
  };

  return (
    <SharedContext.Provider value={contextValue}>
      {children}
    </SharedContext.Provider>
  );
};

// Custom hook to use the context
export const useSharedContext = () => {
  const context = useContext(SharedContext);
  if (context === undefined) {
    throw new Error("useSharedContext must be used within a SharedProvider");
  }
  return context;
};
