import { RoadtripDisplay } from "lib/definitions";
import { formatDateToLocal } from "lib/utils/utils";
import Link from "next/link";

export default function RoutesTableLine({
  roadtrip,
}: {
  roadtrip: RoadtripDisplay;
}) {
  const link = "/viewRoadtrip/" + roadtrip.id;
  return (
    <Link className="tableRow" href={link}>
      <div className="tableItem">{roadtrip.username}</div>
      <div className="tableItem">
        {roadtrip.startland}
        <br />
        {roadtrip.starttown}
      </div>
      <div className="tableItem">
        {roadtrip.destland}
        <br />
        {roadtrip.desttown}
      </div>
      <div className="tableItem">
        {formatDateToLocal(roadtrip.roadtripDate)}
      </div>
    </Link>
  );
}
