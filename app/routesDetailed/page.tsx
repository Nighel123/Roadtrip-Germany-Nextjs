import Image from "next/image";
import Link from "next/link";
import RoutesTable from "../routesOverview/routesTable";
import { Suspense } from "react";
import { MapSkeleton, TableSkeleton } from "app/ui/skeletons";
import MapWrapper from "app/ui/mapWrapper";

import "@/styles/routesDetailed.css";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadtrips detailliert",
};

export default async function RoutesDetailed() {
  return (
    <div className="routesDetailed" data-testid="routesOverview">
      <Link href="/" id="title">
        <Image src="/title.jpg" alt="title" width={1374} height={567} />
      </Link>

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
