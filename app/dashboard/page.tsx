import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { MapSkeleton, TableSkeleton } from "app/ui/skeletons";

import "@/styles/dashboard.css";

import { Metadata } from "next";
import MapWrapperDash from "./mapWrapperDash";
import RoutesTableDash from "./routesTableDash";
import { fetchRoadtripsByUserID } from "app/lib/data";
import { auth } from "auth";

export const metadata: Metadata = {
  title: "Roadtrips übersicht",
};

export default async function dashboard() {
  const session = await auth();
  const userID = session?.user?.id;
  if (!userID) return null;
  const roadtrips = await fetchRoadtripsByUserID(userID);
  return (
    <div
      className="routesOverview dashboard"
      id="dashboard"
      data-testid="routesOverview"
    >
      <Link href="/" id="title">
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
          <RoutesTableDash roadtrips={roadtrips} />
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
          <MapWrapperDash />
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
      <Link href="/routesDetailed">
        <Image
          src="/routesOverview/reiseAnsehen.jpg"
          alt="routesDetailed"
          width={662}
          height={145}
        />
      </Link>

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
