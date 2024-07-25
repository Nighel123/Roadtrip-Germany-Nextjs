import Image from "next/image";
import Link from "next/link";
import RoutesTable from "./routesTable";
import { Suspense } from "react";
import { MapSkeleton, TableSkeleton } from "app/ui/skeletons";
import MapWrapper from "app/ui/mapWrapper";

import "@/styles/routesOverview.css";

export default async function RoutesOverview() {
  return (
    <div className="routesOverview" data-testid="routesOverview">
      <Link href="/">
        <Image src="/title.jpg" alt="title" width={1374} height={567} />
      </Link>

      <Image
        src="/routesOverview/blueFrame.jpg"
        alt="blueFrame"
        width={740}
        height={444}
      />
      <div id="tableContainer">
        <Suspense fallback={<TableSkeleton />}>
          <RoutesTable />
        </Suspense>
      </div>

      <Image
        src="/routesOverview/redFrame.jpg"
        alt="redFrame"
        width={2486}
        height={1699}
      />
      <div id="map">
        <Suspense fallback={<MapSkeleton />}>
          <MapWrapper />
        </Suspense>
      </div>

      <Link href="/insertRoadtrip">
        <Image
          src="/routesOverview/eigeneReiseMachen.jpg"
          alt="insertRoadtrip"
          width={662}
          height={147}
        />
      </Link>

      <Image
        src="/routesOverview/reiseAnsehen.jpg"
        alt="routesDetailed"
        width={662}
        height={145}
      />

      <Image
        src="/routesOverview/img1.jpg"
        alt="img1"
        width={2048}
        height={783}
      />
      <Image
        src="/routesOverview/img2.jpg"
        alt="img2"
        width={1536}
        height={345}
      />
    </div>
  );
}
