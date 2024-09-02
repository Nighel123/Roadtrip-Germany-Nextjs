import "@/styles/global.css";
import "@/styles/layout.css";
import "@/styles/home.css";

import { open_sans } from "@/styles/fonts";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import Link from "next/link";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Dict, getDictionary } from "./dictionaries";
import InstagramIcon from "ui/components/insagramIcon";
import FacbookIcon from "ui/components/facebookIcon";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "%s | Roadtrip Germany",
    default: "Roadtrip Germany",
  },
  description:
    "Eine Website um Travelbuddies zu finden und zusammen Roadtrips zu planen.",
  metadataBase: new URL("https://www.roadtrip-germany.de"),
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "de" }];
}

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
      </body>
      <GoogleAnalytics gaId="G-64S5W9QGXN" />
      <GoogleTagManager gtmId="GTM-KWQKHMDZ" />
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
      <Language />
    </footer>
  );
}

function Language() {
  const handleClickFac = (lang: "en" | "de") => async () => {
    "use server";
    const oneDay = 24 * 60 * 60 * 1000;
    cookies().set("NEXT_LOCALE", lang, { expires: Date.now() + 2 * oneDay });
    const headerList = headers();
    const pathname = headerList.get("x-current-roadtrip-path");
    redirect(pathname ? pathname : "/");
  };

  return (
    <div className="langSwitcher">
      <form action={handleClickFac("en")}>
        <button type="submit" className="langButton">
          en
        </button>
      </form>
      <span>|</span>
      <form action={handleClickFac("de")}>
        <button type="submit" className="langButton">
          de
        </button>
      </form>
    </div>
  );
}
