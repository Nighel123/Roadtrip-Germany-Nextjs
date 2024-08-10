import "@/styles/global.css";
import "@/styles/home.css";

import { open_sans } from "@/styles/fonts";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    template: "%s | Roadtrip Germany",
    default: "Roadtrip Germany",
  },
  description:
    "Eine Website um Travelbuddies zu finden und zusammen Roadtrips zu planen.",
  metadataBase: new URL("https://www.roadtrip-germany.de"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      {/* <!-- Google tag (gtag.js) --> */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-64S5W9QGXN"
      ></Script>
      <Script src="./googleAnalytics.js"></Script>
      <SpeedInsights />
      <Analytics />

      <body className={`${open_sans.className} antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer>
      <Link href={"/impressum"}>Impressum</Link>
    </footer>
  );
}
