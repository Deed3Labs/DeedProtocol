// import { useEffect } from "react";
// import Leaflet from "leaflet";
// import "leaflet/dist/leaflet.css";
// import * as ReactLeaflet from "react-leaflet";

// const { MapContainer } = ReactLeaflet;

// type Props = {
//   children?: (ReactLeaflet: any, Leaflet: any) => React.ReactNode;
//   className?: string;
//   width?: number;
//   height?: number;
// };

// const Map = ({ children, className, width, height, ...rest }: Props) => {
//   let mapClassName = "w-full h-screen";

//   if (className) {
//     mapClassName = `${mapClassName} ${className}`;
//   }

//   useEffect(() => {
//     (async function init() {
//       Leaflet.Icon.Default.mergeOptions({
//         iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
//         iconUrl: "leaflet/images/marker-icon.png",
//         shadowUrl: "leaflet/images/marker-shadow.png",
//       });
//     })();
//   }, []);

//   return (
//     <MapContainer className={mapClassName} {...rest}>
//       {children?.(ReactLeaflet, Leaflet)}
//     </MapContainer>
//   );
// };

// export default Map;
