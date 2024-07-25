import { fetchRoadtrips } from "app/lib/data";
import MapLoader from "./mapLoader";
import MyMapComponent from "./map";

export default async function MapWrapper() {
  const roadtrips = await fetchRoadtrips();
  return (
    <MapLoader>
      <MyMapComponent roadtrips={roadtrips} />
    </MapLoader>
  );
}
