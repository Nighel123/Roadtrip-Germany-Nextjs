/* css */
import "@/styles/register.css";
import "@/styles/registerForm.css";

/* components */
import Image from "next/image";
import { Form } from "./registerForm";

const Register = () => {
  return (
    <div className="register">
      <header>
        <h1>Roadtrip-Konto erstellen</h1>
      </header>
      <Image
        id="insertRoadtripImage"
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
