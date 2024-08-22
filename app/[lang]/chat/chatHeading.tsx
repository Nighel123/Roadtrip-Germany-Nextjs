"use client";
import Image from "next/image";
import { Dispatch, SetStateAction, Suspense, useState } from "react";
import MyMapComponent from "../../../ui/map";
import { RoadtripDisplay } from "lib/definitions";
import MapLoader from "ui/mapLoader";
import ChatSidebar from "./chatSidebar";
import { formatDateToLocal } from "lib/utils/utils";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import "@/styles/chat.css";
import ChatForm from "./chatForm";
import { useSession } from "next-auth/react";
import { Dict } from "../dictionaries";
import Link from "next/link";

export default function ChatHeading({ dict }: { dict: Dict }) {
  const [roadtripID, setRoadtripID] = useState<string | null>(null);
  const [otherUserID, setOtherUserID] = useState<number | null>(null);

  return (
    <div id="messageContainer">
      <Suspense>
        <ChatSidebar
          setRoadtripID={setRoadtripID}
          setOtherUserID={setOtherUserID}
          dict={dict}
        />
      </Suspense>
      {roadtripID ? (
        <Suspense>
          <Heading
            roadtripID={roadtripID}
            setOtherUserID={setOtherUserID}
            otherUserID={otherUserID}
            dict={dict}
          />
        </Suspense>
      ) : null}
      {roadtripID && otherUserID ? (
        <ChatForm
          roadtripID={roadtripID}
          otherUserID={otherUserID}
          dict={dict}
        />
      ) : null}
    </div>
  );
}

function Heading({
  roadtripID,
  otherUserID,
  setOtherUserID,
  dict,
}: {
  roadtripID: string;
  otherUserID: number | null;
  setOtherUserID: Dispatch<SetStateAction<number | null>>;
  dict: Dict;
}) {
  const { heading } = dict.chat;
  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const sesssion = useSession();
  const { isPending, isError, data, error } = useQuery({
    queryKey: [roadtripID],
    queryFn: async () => {
      const response = await fetch(`/api/chat/roadtrip?id=${roadtripID}`);
      if (!response.ok) {
        throw new Error("Network response for fetching Roadtrip was not ok");
      }
      const roadtrip = (await response.json())[0] as RoadtripDisplay;
      if (search) {
        if (
          roadtrip.user_id !== Number(sesssion.data?.user?.id) &&
          !otherUserID
        )
          setOtherUserID(roadtrip.user_id);
      }
      return roadtrip;
    },
  });
  if (isPending) {
    return <span className="queryStatus">Loading...</span>;
  }

  if (isError) {
    return <span className="queryStatus">Error: {error.message}</span>;
  }
  if (!data) {
    return <span className="queryStatus">No messages yet to see.</span>;
  }
  const roadtrip = data as RoadtripDisplay;
  const {
    date,
    username,
    destland,
    desttown,
    startland,
    starttown,
    image_url,
  } = roadtrip;
  return (
    <>
      <div id="routeInfo">
        <MapLoader>
          <MyMapComponent roadtrips={[roadtrip]} />
        </MapLoader>
        <Link href={`/viewRoadtrip/${roadtrip.id}`}>
          <Image
            src={image_url}
            alt="roadtripPicture"
            width={150}
            height={300}
          />
          <div>
            <h1 className="name">
              {heading.heading} {username}
            </h1>
            <div className="date">{formatDateToLocal(date)}</div>
            <p>
              {startland}, {starttown} &#8594; {destland}, {desttown}
            </p>
          </div>
        </Link>
      </div>
    </>
  );
}
