import { fetchRoadtripsByUserID } from "app/lib/data";
import { RoadtripDisplay } from "app/lib/definitions";
import { auth } from "auth";
import RoutesTableLineDash from "./routesTableLineDash";

export default async function RoutesTableDash() {
  const session = await auth();
  const userID = session?.user?.id;
  if (!userID) return null;
  const roadtrips = await fetchRoadtripsByUserID(userID);
  //console.log(roadtrips);
  const lines = roadtrips.map((roadtrip: RoadtripDisplay) => {
    return (
      <RoutesTableLineDash key={`line-${roadtrip.id}`} roadtrip={roadtrip} />
    );
  });
  return <div id="table">{lines}</div>;
}
