import Link from "next/link";
import Image from "next/image";

export default function Register() {
  return (
    <Link href="/register" id="registerComponent">
      <Image
        src="/home/registrierenBlack.jpg"
        width={468}
        height={149}
        alt="registrieren"
      />
    </Link>
  );
}
