"use client";

import { RoadtripDisplay } from "lib/definitions";
import RoutesTableLineDash from "./routesTableLineDash";
import { Dict } from "../dictionaries";

export default async function RoutesTableDash({
  roadtrips,
  dict,
}: {
  roadtrips: RoadtripDisplay[];
  dict: Dict;
}) {
  //console.log(roadtrips);
  const lines = roadtrips.map((roadtrip: RoadtripDisplay) => {
    return (
      <RoutesTableLineDash
        key={`line-${roadtrip.id}`}
        roadtrip={roadtrip}
        dict={dict}
      />
    );
  });
  if (lines.length === 0) {
    return (
      <>
        <h1 className="noContent">{dict.dashboard.table.noContent.heading}</h1>
        <p className="noContent">{dict.dashboard.table.noContent.paragraph}</p>
      </>
    );
  }
  return <div id="table">{lines}</div>;
}
