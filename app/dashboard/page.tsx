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
import DeleteAccount from "./deleteAccount";

export const metadata: Metadata = {
  title: "Roadtrips übersicht",
};

export default async function Dashboard() {
  const session = await auth();
  const userID = session?.user?.id;
  const roadtrips = await fetchRoadtripsByUserID(userID);

  return (
    <div className="dashboard" id="dashboard" data-testid="routesOverview">
      <Link href="/" id="title">
        <Image src="/title.jpg" alt="title" width={1374} height={567} />
      </Link>
      <div id="userInfo">
        <div id="image">
          {session?.user?.image ? (
            <img src={session?.user?.image} alt="title" />
          ) : null}
        </div>
        <div>
          <p id="heading">Eingelogged als:</p>
          <h2>{session?.user?.name}</h2>
          <p id="email">{session?.user?.email}</p>
        </div>
      </div>

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

      <div id="deleteAccount">
        <DeleteAccount />
      </div>
    </div>
  );
}
