import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { MapSkeleton, TableSkeleton } from "ui/skeletons";

import "@/styles/dashboard.css";

import { Metadata } from "next";
import MapWrapperDash from "./mapWrapperDash";
import RoutesTableDash from "./routesTableDash";
import { fetchRoadtripsByUserID } from "lib/data";
import { auth } from "auth";
import DeleteAccount from "./deleteAccount";
import { getDictionary } from "../dictionaries";

export const metadata: Metadata = {
  title: "Roadtrips übersicht",
};

export default async function Dashboard({
  params: { lang },
}: {
  params: { lang: "en" | "de" };
}) {
  const dict = await getDictionary(lang);
  const { dashboard } = dict;
  const session = await auth();
  const userID = session?.user?.id;
  const roadtrips = await fetchRoadtripsByUserID(userID);

  return (
    <div className="dashboard" id="dashboard" data-testid="routesOverview">
      <Link href="/" id="title">
        <Image src="/images/title.jpg" alt="title" width={1374} height={567} />
      </Link>
      <div id="userInfo">
        <div id="image">
          {session?.user?.image ? (
            <img src={session?.user?.image} alt="title" />
          ) : null}
        </div>
        <div>
          <p id="heading">{dashboard.status}</p>
          <h2>{session?.user?.name}</h2>
          <p id="email">{session?.user?.email}</p>
        </div>
      </div>

      <Image
        src="/images/routesOverview/blueFrame.jpg"
        alt="blueFrame"
        width={740}
        height={444}
      />
      <div id="tableContainer">
        <Suspense fallback={<TableSkeleton />}>
          <RoutesTableDash roadtrips={roadtrips} dict={dict} />
        </Suspense>
      </div>

      <Image
        src="/images/routesOverview/redFrame.jpg"
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
        <DeleteAccount dict={dict} />
      </div>
    </div>
  );
}
