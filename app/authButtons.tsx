import { auth, signOut } from "auth";
import Image from "next/image";
import Link from "next/link";
import { SignInButton } from "../ui/signInButton";
import NewMessageCounter from "./newMessageCounter";
import Register from "../ui/components/register";

export default async function AuthButtons() {
  const session = await auth();
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
          </Link>
        </>
      ) : (
        <>
          <SignInButton />
          <Register />
        </>
      )}
    </>
  );
}
