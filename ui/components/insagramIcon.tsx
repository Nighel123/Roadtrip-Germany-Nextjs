import Image from "next/image";
import Link from "next/link";

export default function InstagramIcon() {
  return (
    <Link
      href={"https://www.instagram.com/roadtripgermany/"}
      className="social-icon instagram"
    >
      <Image
        src={"/images/icons/instagram-outline.jpg"}
        width={170}
        height={160}
        alt="instagram-logo"
      />
    </Link>
  );
}
