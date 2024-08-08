import { fetchRoadtripsByUserID } from "app/lib/data";
import MapLoader from "app/ui/mapLoader";
import MyMapComponent from "app/ui/map";
import { auth } from "auth";

export default async function MapWrapper() {
  const session = await auth();
  const userID = session?.user?.id;
  if (!userID) return null;
  const roadtrips = await fetchRoadtripsByUserID(userID);
  return (
    <MapLoader>
      <MyMapComponent roadtrips={roadtrips} />
    </MapLoader>
  );
}
