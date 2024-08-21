import Image from "next/image";

import "@/styles/chat.css";

import { Metadata } from "next";

import Chat from "./chat";
import Title from "ui/components/title";
import { getDictionary } from "../dictionaries";

export const metadata: Metadata = {
  title: "Roadtrip Chat",
};

export default async function Page({
  params: { lang },
}: {
  params: { lang: "en" | "de" };
}) {
  const dict = await getDictionary(lang);

  return (
    <div className="chat" data-testid="chat">
      <Title />

      <div className="frame">
        <Image
          src="/routesDetailed/map.jpg"
          alt="blueFrame"
          width={3245}
          height={1819}
        />

        <Chat dict={dict} />

        {/* <Suspense fallback={<MapSkeleton />}>
          <MapWrapper />
        </Suspense> */}
      </div>
    </div>
  );
}
