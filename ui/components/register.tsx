import Link from "next/link";
import Image from "next/image";
import { Dict } from "app/[lang]/dictionaries";

export default function Register({ dict }: { dict: Dict }) {
  return (
    <Link href="/register" id="registerComponent">
      <Image
        src={dict.home.register}
        width={468}
        height={149}
        alt="registrieren"
      />
    </Link>
  );
}
