"use client";

import { RoadtripDisplay } from "app/lib/definitions";
import RoutesTableLineDash from "./routesTableLineDash";
import Modal from "react-modal";
import { useState } from "react";

export default async function RoutesTableDash({
  roadtrips,
}: {
  roadtrips: RoadtripDisplay[];
}) {
  //console.log(roadtrips);
  const lines = roadtrips.map((roadtrip: RoadtripDisplay) => {
    return (
      <RoutesTableLineDash key={`line-${roadtrip.id}`} roadtrip={roadtrip} />
    );
  });
  if (lines.length === 0) {
    return (
      <>
        <h1 className="noContent">
          Hier werden deine eigenen Roadtrips angezeigt.
        </h1>
        <p className="noContent">
          Du hast noch keine Roadtrips eingestellt. Klicke auf "eigenen Roadtrip
          machen" um einen eigenen Roadtrip einzustellen.
        </p>
      </>
    );
  }
  return <div id="table">{lines}</div>;
}
