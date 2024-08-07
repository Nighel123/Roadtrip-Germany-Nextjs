"use client";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import MyMapComponent from "../ui/map";
import { RoadtripDisplay } from "app/lib/definitions";
import MapLoader from "app/ui/mapLoader";
import ChatSidebar from "./chatSidebar";
import { formatDateToLocal } from "app/lib/utils";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import "@/styles/chat.css";
import ChatForm from "./chatForm";
import { useSession } from "next-auth/react";

export default function ChatHeading() {
  const [roadtripID, setRoadtripID] = useState<string | null>(null);
  const [otherUserID, setOtherUserID] = useState<number | null>(null);

  return (
    <div id="messageContainer">
      <ChatSidebar
        setRoadtripID={setRoadtripID}
        setOtherUserID={setOtherUserID}
      />
      {roadtripID ? (
        <Heading
          roadtripID={roadtripID}
          setOtherUserID={setOtherUserID}
          otherUserID={otherUserID}
        />
      ) : null}
      {roadtripID && otherUserID ? (
        <ChatForm roadtripID={roadtripID} otherUserID={otherUserID} />
      ) : null}
    </div>
  );
}

function Heading({
  roadtripID,
  otherUserID,
  setOtherUserID,
}: {
  roadtripID: string;
  otherUserID: number | null;
  setOtherUserID: Dispatch<SetStateAction<number | null>>;
}) {
  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const sesssion = useSession();
  const { isPending, isError, data, error } = useQuery({
    queryKey: [roadtripID],
    queryFn: async () => {
      const response = await fetch(`api/chat/roadtrip?id=${roadtripID}`);
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
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  if (!data) {
    return <span>No messages yet to see.</span>;
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
        <Image src={image_url} alt="roadtripPicture" width={150} height={300} />
        <h1 className="name">{username}</h1>
        <div className="date">{formatDateToLocal(date)}</div>
        <p>
          {startland},{starttown} &#8594; {destland},{desttown}
        </p>
      </div>
    </>
  );
}
