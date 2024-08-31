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
    //mapPlot(ref, roadtrips, options, router);
  });

  return <div ref={ref} id="mapcontent" />;
}
