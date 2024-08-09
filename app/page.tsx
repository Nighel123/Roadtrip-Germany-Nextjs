import { auth, signOut } from "auth";
import Image from "next/image";
import Link from "next/link";
import { SignInButton } from "./ui/signInButton";
import { fetchNewMessagesCountByUserId } from "./lib/data";

export default async function Page() {
  const session = await auth();
  /* console.log(session); */

  return (
    <>
      {session?.user ? (
        <>
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
          <Link href={"/chat"} id="chatLink">
            <Image
              src="/chat/messages.jpg"
              width={400}
              height={400}
              alt="registrieren"
            />
            <NewMessageCounter />
          </Link>
          <Link href={"/dashboard"} id="settings">
            <Image
              src="/home/settings.png"
              width={400}
              height={400}
              alt="registrieren"
            />
            <NewMessageCounter />
          </Link>
        </>
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

        {/* <Image
          id="beispielTrip"
          src="/home/beispielTrip.jpeg"
          width={2048}
          height={1376}
          alt="beispielTrip"
        /> */}
      </div>
    </>
  );
}

async function NewMessageCounter() {
  const session = await auth();
  const userID = session?.user?.id;
  if (!userID) return;
  const count = (await fetchNewMessagesCountByUserId(userID)) as string;
  return <>{Number(count) ? <p id="newMessageCounter">{count}</p> : null}</>;
}
