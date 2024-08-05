import Image from "next/image";
import Link from "next/link";
import MessagesTable from "./massagesTable";
import { Suspense } from "react";
import { MapSkeleton, TableSkeleton } from "app/ui/skeletons";
import MapWrapper from "app/ui/mapWrapper";

import "@/styles/chat.css";

import { Metadata } from "next";
import MessagesContainer from "./massagesContainer";
import { fetchMessagesByUserId } from "app/lib/data";

export const metadata: Metadata = {
  title: "Roadtrip Chat",
};

export default async function Chat() {
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

        <MessagesContainer /* messages={messages} */ />

        {/* <Suspense fallback={<MapSkeleton />}>
          <MapWrapper />
        </Suspense> */}
      </div>
    </div>
  );
}
