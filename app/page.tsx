import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "App Router",
};

export default function Page() {
  return (
    <div className="home" data-testid="home">
      <Image src="/title.jpg" width={1374} height={567} alt="title" />
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
    </div>
  );
}
