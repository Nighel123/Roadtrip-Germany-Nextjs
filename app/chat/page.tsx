import Image from "next/image";
import Link from "next/link";

import "@/styles/chat.css";

import { Metadata } from "next";

import Chat from "./chat";

export const metadata: Metadata = {
  title: "Roadtrip Chat",
};

export default function Page() {
  //const messages = await fetchMessagesByUserId(/* userId */);

  return (
    <div className="chat" data-testid="routesOverview">
      <Link href="/" id="title">
        <Image src="/title.jpg" alt="title" width={1374} height={567} />
      </Link>

      <div className="frame">
        <Image
          src="/routesDetailed/map.jpg"
          alt="blueFrame"
          width={3245}
          height={1819}
        />

        <Chat />

        {/* <Suspense fallback={<MapSkeleton />}>
          <MapWrapper />
        </Suspense> */}
      </div>
    </div>
  );
}
