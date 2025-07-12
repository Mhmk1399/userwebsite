"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface CanvasContextType {
  selectedElementId: string | null;
  setSelectedElementId: React.Dispatch<React.SetStateAction<string | null>>;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );

  // Clear selected element on unmount
  useEffect(() => {
    return () => {
      setSelectedElementId(null);
    };
  }, []);

  return (
    <CanvasContext.Provider value={{ selectedElementId, setSelectedElementId }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};
