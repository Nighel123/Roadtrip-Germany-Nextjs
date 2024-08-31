import { fetchRoadtripsByUserID } from "lib/data/roadtrips";
import MapLoader from "ui/mapLoader";
import MyMapComponent from "ui/map";
import { auth } from "auth";
import { Dict } from "../dictionaries";

export default async function MapWrapper({ dict }: { dict: Dict }) {
  const session = await auth();
  const userID = session?.user?.id;
  const roadtrips = await fetchRoadtripsByUserID(userID);
  const {
    dashboard: { map },
  } = dict;
  return (
    <MapLoader>
      {roadtrips.length === 0 ? (
        <>
          <h1 className="noContent">{map.heading}</h1>
          <p className="noContent">{map.paragraph}</p>
        </>
      ) : (
        <MyMapComponent roadtrips={roadtrips} />
      )}
    </MapLoader>
  );
}
