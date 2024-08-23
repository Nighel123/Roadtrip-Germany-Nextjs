/* css */
import "@/styles/register.css";
import "@/styles/registerForm.css";

/* components */
import Image from "next/image";
import { Form } from "./registerForm";

import { Metadata } from "next";
import Title from "ui/components/title";
import { getDictionary } from "../dictionaries";

export const metadata: Metadata = {
  title: "Registrieren",
};

const Register = async ({
  params: { lang },
}: {
  params: { lang: "de" | "en" };
}) => {
  const dict = await getDictionary(lang);
  const { register } = dict;
  return (
    <div className="register">
      <header>
        <h1>{register.heading}</h1>
      </header>
      <Title />
      <Image
        src="/images/register/registerSide.jpg"
        alt="australian roads"
        width={1005}
        height={850}
      />
      <Form dict={dict} />
    </div>
  );
};

export default Register;
