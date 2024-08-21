import Link from "next/link";
import Image from "next/image";

export default function Title() {
  return (
    <Link href="/" id="titleComponent">
      <Image
        src="/images/homeButton.jpg"
        alt="title"
        width={343}
        height={142}
      />
    </Link>
  );
}
