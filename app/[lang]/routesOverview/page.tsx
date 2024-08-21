import Image from "next/image";
import Link from "next/link";
import RoutesTable from "./routesTable";
import { Suspense } from "react";
import { MapSkeleton, TableSkeleton } from "ui/skeletons";
import MapWrapper from "ui/mapWrapper";

import "@/styles/routesOverview.css";

import { Metadata } from "next";
import AuthButtons from "app/[lang]/authButtons";
import { getDictionary } from "../dictionaries";

export const metadata: Metadata = {
  title: "Roadtrips übersicht",
};

export default async function RoutesOverview({
  params: { lang },
}: {
  params: { lang: "en" | "de" };
}) {
  const dict = await getDictionary(lang);
  const { routesOverview } = dict;
  return (
    <>
      <Suspense>
        <AuthButtons dict={dict} />
      </Suspense>
      <div className="routesOverview" data-testid="routesOverview">
        <Link href="/">
          <Image src="/title.jpg" alt="title" width={1374} height={567} />
        </Link>

        <Image
          src="/images/routesOverview/blueFrame.jpg"
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
          src="/images/routesOverview/redFrame.jpg"
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
            src={routesOverview.createTrip}
            alt="insertRoadtrip"
            width={662}
            height={147}
          />
        </Link>
        <Link href="/routesDetailed">
          <Image
            src={routesOverview.viewTrips}
            alt="routesDetailed"
            width={662}
            height={145}
          />
        </Link>

        <Image
          src="/images/routesOverview/img1.jpg"
          alt="img1"
          width={2048}
          height={783}
        />
        <Image
          src="/images/routesOverview/img2.jpg"
          alt="img2"
          width={1536}
          height={345}
        />
      </div>
    </>
  );
}
