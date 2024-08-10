/* css */
import "@/styles/login.css";

/* components */
import Image from "next/image";
import Link from "next/link";
import { Form } from "./loginForm";
import { Suspense } from "react";

import { Metadata } from "next";
import Title from "ui/components/title";
import Register from "ui/components/register";

export const metadata: Metadata = {
  title: "Login",
};

const Login = () => {
  return (
    <div className="login">
      <header>
        <Title />
        <Register />
      </header>
      <Suspense>
        <Form />
      </Suspense>
    </div>
  );
};

export default Login;
