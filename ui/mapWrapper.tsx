import { fetchRoadtrips } from "lib/data";
import MapLoader from "./mapLoader";
import MyMapComponent from "./map";

export default async function MapWrapper() {
  const roadtrips = await fetchRoadtrips();
  const cutRoadArr = roadtrips.slice(0, 5);
  return (
    <MapLoader>
      <MyMapComponent roadtrips={cutRoadArr} />
    </MapLoader>
  );
}
