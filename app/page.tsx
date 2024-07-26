import { auth, signOut } from "auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { SignInButton } from "./ui/signInButton";

export const metadata = {
  title: "App Router",
};

export default async function Page() {
  const session = await auth();
  /* console.log(session); */

  return (
    <>
      {session?.user ? (
        <form
          id="ausloggen"
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <input
            type="image"
            src="/home/ausloggen.jpg"
            width={408}
            height={145}
            alt="ausloggen"
          />
        </form>
      ) : (
        <>
          <SignInButton />
          <Link href="/register" id="register">
            <Image
              src="/home/registrierenBlack.jpg"
              width={468}
              height={149}
              alt="registrieren"
            />
          </Link>
        </>
      )}
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
