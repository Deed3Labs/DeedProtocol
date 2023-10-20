// import React, { createContext, useContext, useState } from "react";

// interface MapContextProps {
//   map: L.Map | null;
//   setMap: React.Dispatch<React.SetStateAction<L.Map | null>>;
// }

// const MapContext = createContext<MapContextProps | null>(null);

// export const useLeafletMap = () => {
//   const context = useContext(MapContext);
//   if (!context) {
//     throw new Error("useLeafletMap must be used within a MapProvider");
//   }
//   return context;
// };

// interface MapProviderProps {
//   children: React.ReactNode;
// }

// export const LeafletMapProvider: React.FC<MapProviderProps> = ({ children }) => {
//   const [map, setMap] = useState<L.Map | null>(null);

//   return <MapContext.Provider>{children}</MapContext.Provider>;
// };

export {};
