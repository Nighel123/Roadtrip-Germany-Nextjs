import { Roadtrip, RoadtripDisplay } from "app/lib/definitions";
import { formatDateToLocal } from "app/lib/utils";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function routesTableLineDash({
  roadtrip,
}: {
  roadtrip: RoadtripDisplay;
}) {
  const link = "/viewRoadtrip/" + roadtrip.id;
  return (
    <div className="tableRow">
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
      <div className="tableItem">{formatDateToLocal(roadtrip.date)}</div>
      <Link href={`/insertRoadtrip?id=${roadtrip.id}`}>
        <div className="tableItem edit">
          <PencilIcon />
        </div>
      </Link>
      <div className="tableItem edit">
        <TrashIcon />
      </div>
    </div>
  );
}
