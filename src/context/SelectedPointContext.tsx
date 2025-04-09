import React, { createContext, useContext, useState } from "react";

interface SelectedPoint {
  x: number;
  y: number;
  word: string;
}

interface SelectedPointContextProps {
  selectedPoint: SelectedPoint | null;
  setSelectedPoint: React.Dispatch<React.SetStateAction<SelectedPoint | null>>;
}

const SelectedPointContext = createContext<
  SelectedPointContextProps | undefined
>(undefined);

export const SelectedPointProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(
    null
  );

  return (
    <SelectedPointContext.Provider value={{ selectedPoint, setSelectedPoint }}>
      {children}
    </SelectedPointContext.Provider>
  );
};

export const useSelectedPoint = (): SelectedPointContextProps => {
  const context = useContext(SelectedPointContext);
  if (!context) {
    throw new Error(
      "useSelectedPoint must be used within a SelectedPointProvider"
    );
  }
  return context;
};
