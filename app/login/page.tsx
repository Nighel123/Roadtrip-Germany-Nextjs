/* css */
import "@/styles/login.css";

/* components */
import Image from "next/image";
import Link from "next/link";
import { Form } from "./loginForm";

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

      <Form />
    </div>
  );
};

export default Login;
