"use client";

import { RoadtripDisplay } from "app/lib/definitions";
import { mapPlot } from "app/lib/mapPlot";
import { useEffect, useRef } from "react";

export default function Map({ roadtrips }: { roadtrips: RoadtripDisplay[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapPlot(ref, 4, 10, "11", true, true, roadtrips);
  });

  return <div ref={ref} id="mapcontent" />;
}
