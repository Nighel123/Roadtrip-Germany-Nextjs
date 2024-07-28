import { fetchRoadtrips } from "app/lib/data";
import { RoadtripDisplay } from "app/lib/definitions";
import RoutesTableLine from "./routesTableLine";

export default async function RoutesTable() {
  const roadtrips = await fetchRoadtrips();
  //console.log(roadtrips);
  const lines = roadtrips.map((roadtrip: RoadtripDisplay) => {
    return <RoutesTableLine key={`line-${roadtrip.id}`} roadtrip={roadtrip} />;
  });
  return <div id="table">{lines}</div>;
}
