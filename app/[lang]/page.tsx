import Image from "next/image";
import Link from "next/link";
import AuthButtons from "./authButtons";
import { Suspense } from "react";
import { getDictionary } from "./dictionaries";

export default async function Page({
  params: { lang },
}: {
  params: { lang: "en" | "de" };
}) {
  const dict = await getDictionary(lang);
  return (
    <>
      <Suspense>
        <AuthButtons dict={dict} />
      </Suspense>
      <div className="home" data-testid="home">
        <Image src="/images/title.jpg" width={1374} height={567} alt="Titel" />
        <Link href="/routesOverview">
          <Image
            src={dict.home.actualRoutes}
            width={1000}
            height={227}
            alt="routesOverview"
          />
        </Link>
        <Link href="/insertRoadtrip">
          <Image
            src={dict.home.makeYourTrip}
            width={1000}
            height={241}
            alt="insertRoadtrip"
          />
        </Link>

        <Image
          id="beispielTrip"
          src="/images/home/beispielTrip.jpeg"
          width={2048}
          height={1376}
          alt="beispielTrip"
        />
      </div>
    </>
  );
}
