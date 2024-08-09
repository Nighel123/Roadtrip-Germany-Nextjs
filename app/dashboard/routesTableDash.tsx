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
  return (
    <>
      <div id="table">{lines}</div>
    </>
  );
}
