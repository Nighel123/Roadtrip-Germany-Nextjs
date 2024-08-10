import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import "@/styles/viewRoadtrip.css";
import RoadtripWrapper from "./roadtripWrapper";
import { Metadata } from "next";
import Title from "app/ui/components/title";

export const metadata: Metadata = {
  title: "Roadtrip anschauen",
};

export default async function ViewRoadtrip({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  return (
    <div className="viewRoadtrip" data-testid="viewRoadtrip">
      <Title />

      <Suspense>
        <RoadtripWrapper id={id} />
      </Suspense>
    </div>
  );
}
