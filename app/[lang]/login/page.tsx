/* css */
import "@/styles/login.css";

/* components */
import { Form } from "./loginForm";
import { Suspense } from "react";

import { Metadata } from "next";
import Title from "ui/components/title";
import Register from "ui/components/register";
import { getDictionary } from "../dictionaries";

export const metadata: Metadata = {
  title: "Login",
};

const Login = async ({
  params: { lang },
}: {
  params: { lang: "en" | "de" };
}) => {
  const dict = await getDictionary(lang);
  return (
    <div className="login">
      <header>
        <Title />
        <Register dict={dict} />
      </header>
      <Suspense>
        <Form dict={dict} lang={lang} />
      </Suspense>
    </div>
  );
};

export default Login;
