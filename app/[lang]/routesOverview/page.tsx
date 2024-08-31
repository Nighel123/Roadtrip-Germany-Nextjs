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
import Search from "ui/search";

export const metadata: Metadata = {
  title: "Roadtrips übersicht",
};

export default async function RoutesOverview({
  params: { lang },
  searchParams,
}: {
  params: { lang: "en" | "de" };
  searchParams?: {
    query?: string;
  };
}) {
  const dict = await getDictionary(lang);
  const { routesOverview } = dict;

  const query = searchParams?.query || "";
  return (
    <>
      <Suspense>
        <AuthButtons dict={dict} />
      </Suspense>
      <div className="routesOverview" data-testid="routesOverview">
        <Link id="titleImage" href="/">
          <Image src="/images/title.jpg" alt="title" width={992} height={409} />
        </Link>

        <Image
          src="/images/routesOverview/blueFrame.jpg"
          alt="blueFrame"
          width={567}
          height={340}
        />
        <Search placeholder={dict.routesOverview.searchPlaceholder} />
        <div id="tableContainer">
          <Suspense key={query} fallback={<TableSkeleton />}>
            <RoutesTable query={query} />
          </Suspense>
        </div>

        <Image
          src="/images/routesOverview/redFrame.jpg"
          alt="redFrame"
          width={850}
          height={581}
        />
        <div id="map">
          <Suspense fallback={<MapSkeleton />}>
            <MapWrapper query={query} />
          </Suspense>
        </div>

        <Link href="/insertRoadtrip">
          <Image
            src={routesOverview.createTrip}
            alt="insertRoadtrip"
            width={283}
            height={63}
          />
        </Link>
        <Link href="/routesDetailed">
          <Image
            src={routesOverview.viewTrips}
            alt="routesDetailed"
            width={283}
            height={62}
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
