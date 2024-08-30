import { fetchRoadtrips } from "lib/data/roadtrips";
import RoutesTableLine from "./routesTableLine";
import { RoadtripDisplay } from "lib/definitions";

export default async function RoutesTable() {
  const roadtrips = await fetchRoadtrips();
  //console.log(roadtrips);
  const lines = roadtrips.map((roadtrip: RoadtripDisplay) => {
    return <RoutesTableLine key={`line-${roadtrip.id}`} roadtrip={roadtrip} />;
  });
  return <div id="table">{lines}</div>;
}
