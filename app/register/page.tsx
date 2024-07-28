/* css */
import "@/styles/register.css";
import "@/styles/registerForm.css";

/* components */
import Image from "next/image";
import { Form } from "./registerForm";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrieren",
};

const Register = () => {
  return (
    <div className="register">
      <header>
        <h1>Roadtrip-Konto erstellen</h1>
      </header>
      <Image
        src="/register/registerSide.jpg"
        alt="australian roads"
        width={1005}
        height={850}
      />
      <Form />
    </div>
  );
};

export default Register;
