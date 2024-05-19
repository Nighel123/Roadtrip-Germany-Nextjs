import { fetchRoadtrips } from "app/lib/data";
import RoutesTableLine from "./RoutesTableLine";
import { RoadtripDisplay } from "app/lib/definitions";
import Map from "../ui/MapLoader";

export default async function RoutesTable() {
  const roadtrips = await fetchRoadtrips();
  const lines = roadtrips.map((roadtrip: RoadtripDisplay) => {
    return <RoutesTableLine key={`line-${roadtrip.id}`} roadtrip={roadtrip} />;
  });
  return (
    <table id="roadtripslist" /* style={{ border-collapse:"collapse" }} */>
      <tbody>{lines}</tbody>
    </table>
  );
}
