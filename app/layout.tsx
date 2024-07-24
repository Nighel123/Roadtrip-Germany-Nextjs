import "@/styles/global.css";
import "@/styles/home.css";
import "@/styles/routesOverview.css";
import { open_sans } from "@/styles/fonts";
import Link from "next/link";
import Image from "next/image";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={`${open_sans.className} antialiased`}>{children}</body>
    </html>
  );
}
