import Image from "next/image";
import Link from "next/link";

export default function FacbookIcon() {
  return (
    <Link
      href={"https://www.facebook.com/profile.php?id=100042878515914"}
      className="social-icon facebook"
    >
      <Image
        src={"/images/icons/facebook-outline.jpg"}
        width={170}
        height={170}
        alt="facebook-logo"
      />
    </Link>
  );
}
