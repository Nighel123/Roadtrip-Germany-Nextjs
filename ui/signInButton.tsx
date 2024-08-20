"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Dict } from "app/[lang]/dictionaries";

export function SignInButton({ dict }: { dict: Dict }) {
  return (
    <Link href="/login" id="login" onClick={() => signIn()}>
      <Image src={dict.home.logIn} width={408} height={145} alt="einloggen" />
    </Link>
  );
}
