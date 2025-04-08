import React, { createContext, useState, ReactNode, useContext } from "react";

// Define the shape of the context
interface RefreshTriggerContextType {
  refreshTrigger: boolean;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with a default value
const RefreshTriggerContext = createContext<
  RefreshTriggerContextType | undefined
>(undefined);

// Create the provider component
export const RefreshTriggerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  return (
    <RefreshTriggerContext.Provider
      value={{ refreshTrigger, setRefreshTrigger }}
    >
      {children}
    </RefreshTriggerContext.Provider>
  );
};

// Custom hook for consuming the context
export const useRefreshTriggerContext = (): RefreshTriggerContextType => {
  const context = useContext(RefreshTriggerContext);
  if (!context) {
    throw new Error(
      "useRefreshTriggerContext must be used within a RefreshTriggerProvider"
    );
  }
  return context;
};
