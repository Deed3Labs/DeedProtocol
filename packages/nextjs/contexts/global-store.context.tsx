// Global store context
import React, { ReactNode, createContext, useContext, useState } from "react";

const GlobalStoreContext = createContext<any>(null);

const GlobalStoreProvider = ({ children }: { children: ReactNode }) => {
  const currentNotificationContentState = useState<string | null>(null);

  return (
    <GlobalStoreContext.Provider value={{ currentNotificationContentState }}>
      {children}
    </GlobalStoreContext.Provider>
  );
};

const useGlobalStore = () => {
  const context = useContext(GlobalStoreContext);
  if (context === undefined) {
    throw new Error("useGlobalStore must be used within a GlobalStoreProvider");
  }
  return context;
};

export { GlobalStoreProvider, useGlobalStore };
