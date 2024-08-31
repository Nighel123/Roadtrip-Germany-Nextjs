import { fetchRoadtrips, fetchRoadtripsMap } from "lib/data/roadtrips";
import MapLoader from "./mapLoader";
import MyMapComponent from "./map";

export default async function MapWrapper({ query }: { query: string }) {
  const roadtrips = await fetchRoadtrips(query);
  const cutRoadArr = roadtrips.slice(0, 3);
  return (
    <MapLoader>
      <MyMapComponent roadtrips={cutRoadArr} />
    </MapLoader>
  );
}
