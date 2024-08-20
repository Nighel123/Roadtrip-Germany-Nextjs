import Image from "next/image";
import Link from "next/link";
import RoutesTable from "../routesOverview/routesTable";
import { Suspense } from "react";
import { MapSkeleton, TableSkeleton } from "ui/skeletons";
import MapWrapper from "ui/mapWrapper";

import "@/styles/routesDetailed.css";

import { Metadata } from "next";
import Title from "ui/components/title";

export const metadata: Metadata = {
  title: "Roadtrips detailliert",
};

export default async function RoutesDetailed() {
  return (
    <div className="routesDetailed" data-testid="routesOverview">
      <Title />

      <div className="grid">
        <Image
          src="/routesDetailed/map.jpg"
          alt="blueFrame"
          width={3245}
          height={1819}
        />
        <div id="tableContainer">
          <Suspense fallback={<TableSkeleton />}>
            <RoutesTable />
          </Suspense>
        </div>

        <Suspense fallback={<MapSkeleton />}>
          <MapWrapper />
        </Suspense>
      </div>
    </div>
  );
}
