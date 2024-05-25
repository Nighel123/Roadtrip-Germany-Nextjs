import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "App Router",
};

export default function Page() {
  return (
    <>
      <Link href="/login" id="login">
        <Image
          src="/home/einloggenBlack.jpg"
          width={408}
          height={145}
          alt="einloggen"
        />
      </Link>
      <Link href="/register" id="register">
        <Image
          src="/home/registrierenBlack.jpg"
          width={468}
          height={149}
          alt="registrieren"
        />
      </Link>
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
      </div>
    </>
  );
}
