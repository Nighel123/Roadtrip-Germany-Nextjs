import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import "@/styles/viewRoadtrip.css";
import RoadtripWrapper from "./roadtripWrapper";

export default async function ViewRoadtrip({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  return (
    <div className="viewRoadtrip" data-testid="viewRoadtrip">
      <Link href="/" id="title">
        <Image src="/title.jpg" alt="title" width={1374} height={567} />
      </Link>

      <Suspense>
        <RoadtripWrapper id={id} />
      </Suspense>
    </div>
  );
}
