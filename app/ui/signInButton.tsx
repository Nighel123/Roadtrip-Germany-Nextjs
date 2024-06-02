"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";

export function SignInButton() {
  return (
    <Link href="/login" id="login" onClick={() => signIn()}>
      <Image
        src="/home/einloggenBlack.jpg"
        width={408}
        height={145}
        alt="einloggen"
      />
    </Link>
  );
}
