import { fetchRoadtrips } from "lib/data/roadtrips";
import RoutesTableLine from "./routesTableLine";
import { RoadtripDisplay } from "lib/definitions";
import Search from "ui/search";

export default async function RoutesTable({ query }: { query: string }) {
  const roadtrips = await fetchRoadtrips(query);
  //console.log(roadtrips);
  const lines = roadtrips.map((roadtrip: RoadtripDisplay) => {
    return <RoutesTableLine key={`line-${roadtrip.id}`} roadtrip={roadtrip} />;
  });
  return <div id="table">{lines}</div>;
}
