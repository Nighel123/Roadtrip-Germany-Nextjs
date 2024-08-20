import { fetchRoadtripsByUserID } from "lib/data";
import MapLoader from "ui/mapLoader";
import MyMapComponent from "ui/map";
import { auth } from "auth";

export default async function MapWrapper() {
  const session = await auth();
  const userID = session?.user?.id;
  const roadtrips = await fetchRoadtripsByUserID(userID);

  return (
    <MapLoader>
      <MyMapComponent roadtrips={roadtrips} />
    </MapLoader>
  );
}
