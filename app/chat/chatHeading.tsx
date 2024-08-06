"use client";
import Image from "next/image";

import { useState } from "react";
import MyMapComponent from "../ui/map";

import "@/styles/chat.css";

import { MessagesDisplay, RoadtripDisplay } from "app/lib/definitions";
import MapLoader from "app/ui/mapLoader";
import ChatSidebar from "./chatSidebar";
import ChatForm from "./chatForm";
import { head } from "@vercel/blob";
import { formatDateToLocal } from "app/lib/utils";

export default function ChatHeading() {
  const [heading, setHeading] = useState<MessagesDisplay | null>(null);

  return (
    <div id="messageContainer">
      <ChatSidebar setHeading={setHeading} />
      {heading ? <Heading heading={heading} /> : null}
    </div>
  );
}

function Heading({ heading }: { heading: MessagesDisplay }) {
  const {
    otherUserName,
    startLand,
    startTown,
    destLand,
    destTown,
    roadtripImageURL,
    roadtripCreatorId,
    created,
  } = heading;
  const roadtripUserName =
    roadtripCreatorId === 7 ? "Nighel1234" : otherUserName;
  const roadtrip = {
    startland: startLand,
    starttown: startTown,
    destland: destTown,
    desttown: destTown,
    username: roadtripUserName,
  } as unknown as RoadtripDisplay;
  return (
    <>
      <div id="routeInfo">
        <MapLoader>
          <MyMapComponent roadtrips={[roadtrip]} />
        </MapLoader>
        <Image
          src={roadtripImageURL}
          alt="roadtripPicture"
          width={150}
          height={300}
        />
        <h1 className="name">{otherUserName}</h1>
        <div className="date">{formatDateToLocal(created)}</div>
        <p>
          {startLand},{startTown} &#8594; {destLand},{destTown}
        </p>
      </div>
      <ChatForm heading={heading} />
    </>
  );
}
