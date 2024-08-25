import "@/styles/global.css";
import "@/styles/layout.css";
import "@/styles/home.css";

import { open_sans } from "@/styles/fonts";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Dict, getDictionary } from "./dictionaries";
import OnClose from "./onClose";
import InstagramIcon from "ui/components/insagramIcon";
import FacbookIcon from "ui/components/facebookIcon";

export const metadata: Metadata = {
  title: {
    template: "%s | Roadtrip Germany",
    default: "Roadtrip Germany",
  },
  description:
    "Eine Website um Travelbuddies zu finden und zusammen Roadtrips zu planen.",
  metadataBase: new URL("https://www.roadtrip-germany.de"),
};

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: "en" | "de" };
}) {
  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <SpeedInsights />
      <Analytics />

      <body className={`${open_sans.className} antialiased`}>
        {children}
        <Footer dict={dict} />
        <OnClose />
      </body>
      <GoogleAnalytics gaId="G-64S5W9QGXN" />
    </html>
  );
}

function Footer({ dict }: { dict: Dict }) {
  const { imprint } = dict;
  return (
    <footer>
      <InstagramIcon />
      <FacbookIcon />
      <Link href={"/impressum"} id="imprint">
        {imprint.headline}
      </Link>
    </footer>
  );
}
