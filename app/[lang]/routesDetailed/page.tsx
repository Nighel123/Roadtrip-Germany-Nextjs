import Image from "next/image";
import Link from "next/link";
import RoutesTable from "../routesOverview/routesTable";
import { Suspense } from "react";
import { MapSkeleton, TableSkeleton } from "ui/skeletons";
import MapWrapper from "ui/mapWrapper";

import "@/styles/routesDetailed.css";

import { Metadata } from "next";
import Title from "ui/components/title";
import Search from "ui/search";
import { getDictionary } from "../dictionaries";

export const metadata: Metadata = {
  title: "Roadtrips detailliert",
};

export default async function RoutesDetailed({
  params: { lang },
  searchParams,
}: {
  params: { lang: "en" | "de" };
  searchParams?: {
    query?: string;
  };
}) {
  const dict = await getDictionary(lang);
  const query = searchParams?.query || "";
  return (
    <div className="routesDetailed" data-testid="routesOverview">
      <Title />

      <div className="grid">
        <Image
          src="/images/routesDetailed/map.jpg"
          alt="blueFrame"
          width={3245}
          height={1819}
        />
        <Search placeholder={dict.routesOverview.searchPlaceholder} />
        <div id="tableContainer">
          <Suspense fallback={<TableSkeleton />}>
            <RoutesTable query={query} dict={dict} />
          </Suspense>
        </div>

        <Suspense fallback={<MapSkeleton />}>
          <MapWrapper query={query} />
        </Suspense>
      </div>
    </div>
  );
}
