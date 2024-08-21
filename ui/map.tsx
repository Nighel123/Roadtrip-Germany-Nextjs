"use client";

import { RoadtripDisplay } from "lib/definitions";
import { mapPlot } from "lib/mapPlot";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Map({ roadtrips }: { roadtrips: RoadtripDisplay[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const options = {
      zoom: 4,
      strokeWeight: 10,
      fontSize: "1vw",
      mapClickable: true,
      routesClickable: true,
    };
    mapPlot(ref, roadtrips, options, router);
  });

  if (roadtrips.length === 0)
    return (
      <>
        <h1 className="noContent">
          Hier wird eine Karte mit deinen Routen angezeigt.
        </h1>
        <p className="noContent">
          Du hast noch keine Roadtrips eingestellt. Klicke auf "eigenen Roadtrip
          machen" um einen eigenen Roadtrip einzustellen.
        </p>
      </>
    );

  return <div ref={ref} id="mapcontent" />;
}
