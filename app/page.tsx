import Image from "next/image";
import Link from "next/link";
import AuthButtons from "./authButtons";
import { Suspense } from "react";

export default async function Page() {
  return (
    <>
      <Suspense>
        <AuthButtons />
      </Suspense>
      <div className="home" data-testid="home">
        <Image src="/title.jpg" width={1374} height={567} alt="Titel" />
        <Link href="/routesOverview">
          <Image
            src="/home/aktuelleRouten.jpg"
            width={1000}
            height={227}
            alt="routesOverview"
          />
        </Link>
        <Link href="/insertRoadtrip">
          <Image
            src="/home/eigenenRoadtripMachen.jpg"
            width={1000}
            height={241}
            alt="insertRoadtrip"
          />
        </Link>

        <Image
          id="beispielTrip"
          src="/home/beispielTrip.jpeg"
          width={2048}
          height={1376}
          alt="beispielTrip"
        />
      </div>
    </>
  );
}
