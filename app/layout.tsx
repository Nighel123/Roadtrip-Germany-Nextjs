import "@/styles/global.css";
import "@/styles/home.css";

import { open_sans } from "@/styles/fonts";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";

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
      <SpeedInsights />
      <Analytics />
      <body className={`${open_sans.className} antialiased`}>{children}</body>
    </html>
  );
}
