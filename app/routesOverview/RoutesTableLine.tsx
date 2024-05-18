import { Roadtrip, RoadtripDisplay } from "app/lib/definitions";
import { formatDateToLocal } from "app/lib/utils";

export default function RoutesTableLine({
  roadtrip,
}: {
  roadtrip: RoadtripDisplay;
}) {
  return (
    <tr
    /*onClick={() => {
         setSelectedRoadtrip(roadtrip);
        navigate("/viewRoadtrip"); 
      }}*/
    >
      <td align="center" style={{ width: "100px" }}>
        {roadtrip.username}
      </td>
      <td align="center">
        {roadtrip.startland}
        <br />
        {roadtrip.starttown}
      </td>
      <td align="center">
        {roadtrip.destland}
        <br />
        {roadtrip.desttown}
      </td>
      <td style={{ width: "200px" }}>{formatDateToLocal(roadtrip.date)}</td>
    </tr>
  );
}
