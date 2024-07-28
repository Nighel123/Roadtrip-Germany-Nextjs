import "@/styles/global.css";
import "@/styles/home.css";

import { open_sans } from "@/styles/fonts";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={`${open_sans.className} antialiased`}>{children}</body>
      <SpeedInsights />
      <Analytics />
    </html>
  );
}
