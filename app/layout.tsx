import "@/styles/global.css";
import "@/styles/home.css";

import { open_sans } from "@/styles/fonts";

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
