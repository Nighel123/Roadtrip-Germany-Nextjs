import { fetchRoadtrips } from "lib/data/roadtrips";
import RoutesTableLine from "./routesTableLine";
import { RoadtripDisplay } from "lib/definitions";
import Search from "ui/search";
import { RoutesTableLineTop } from "./routesTableLineTop";
import { Dict } from "../dictionaries";

export default async function RoutesTable({
  query,
  dict,
}: {
  query: string;
  dict: Dict;
}) {
  const roadtrips = await fetchRoadtrips(query);
  //console.log(roadtrips);
  const lines = roadtrips.map((roadtrip: RoadtripDisplay) => {
    return <RoutesTableLine key={`line-${roadtrip.id}`} roadtrip={roadtrip} />;
  });
  const table = [<RoutesTableLineTop dict={dict} />, ...lines];
  return <div id="table">{table}</div>;
}
