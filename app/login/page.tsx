/* css */
import "@/styles/login.css";

/* components */
import Image from "next/image";
import Link from "next/link";
import { Form } from "./loginForm";
import { Suspense } from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

const Login = () => {
  return (
    <div className="login">
      <header>
        <Link href="/" id="title">
          <Image src="/title.jpg" width={1374} height={567} alt="Titel" />
        </Link>

        <Link href="/register" id="register">
          <Image
            src="/home/registrierenBlack.jpg"
            width={468}
            height={149}
            alt="registrieren"
          />
        </Link>
      </header>
      <Suspense>
        <Form />
      </Suspense>
    </div>
  );
};

export default Login;
