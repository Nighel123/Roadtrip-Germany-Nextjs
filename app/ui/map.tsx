"use client";

import { RoadtripDisplay } from "app/lib/definitions";
import { mapPlot } from "app/lib/mapPlot";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Map({ roadtrips }: { roadtrips: RoadtripDisplay[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    mapPlot(ref, 4, 10, "11", true, true, roadtrips, router);
  });

  return <div ref={ref} id="mapcontent" />;
}
