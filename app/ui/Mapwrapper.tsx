import { fetchRoadtrips } from "app/lib/data";
import MapLoader from "./MapLoader";
import MyMapComponent from "./MyMapComponent";

export default async function MapWrapper(/* { roadtrips }: { roadtrips: RoadtripDisplay[] } */) {
  const roadtrips = await fetchRoadtrips();
  return (
    <MapLoader>
      <MyMapComponent roadtrips={roadtrips} />
    </MapLoader>
  );
}
