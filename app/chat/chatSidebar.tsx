"use client";

import { MessagesDisplay } from "lib/definitions";
import {
  formatDateToLocal,
  nestMessageArrayByOtherUserId,
  nestMessagesToOverviewMessages,
} from "lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ChatMessages from "./chatMessages";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function ChatSidebar({
  setRoadtripID,
  setOtherUserID,
}: {
  setRoadtripID: Dispatch<SetStateAction<string | null>>;
  setOtherUserID: Dispatch<SetStateAction<number | null>>;
}) {
  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<MessagesDisplay[] | null>(null);
  const [nestedMessages, setNestedMessages] = useState<
    MessagesDisplay[][] | null
  >(null);
  const [messagesOverview, setMessagesOverview] = useState<
    MessagesDisplay[] | null
  >(null);
  const handleClickFactory = (index: number) => {
    return (
      nestedMessages: MessagesDisplay[][] | null,
      messagesOverview: MessagesDisplay[] | null
    ) => {
      if (!nestedMessages || nestedMessages.length === 0) return;
      if (!messagesOverview || messagesOverview.length === 0) return;
      const newOverview = [...messagesOverview];
      newOverview[index].read = new Date();
      setMessagesOverview(newOverview);
      setSelectedIndex(index);
      const messages = nestedMessages[index];
      setSelected(messages);
      const roadtripID = messages[0].roadtripId;
      setRoadtripID(roadtripID);
      const otherUserID = messages[0].otherUserId;
      setOtherUserID(otherUserID);
    };
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const response = await fetch(`api/chat`);
      if (!response.ok) {
        throw new Error(
          "Network response for fetching users messages was not ok"
        );
      }
      const [messagesOverview, nestedMessages] = (await response.json()) as [
        MessagesDisplay[],
        MessagesDisplay[][]
      ];

      setNestedMessages(nestedMessages);
      setMessagesOverview(messagesOverview);
      if (search && selectedIndex === null) {
        const index = messagesOverview.findIndex(
          (message) => message.roadtripId === search
        );
        setRoadtripID(search);
        if (index !== -1) {
          // roadtrip was found in messages
          handleClickFactory(index)(nestedMessages, messagesOverview);
        } else {
          return nestedMessages;
        }
      } else {
        if (selectedIndex === null) {
          handleClickFactory(0)(nestedMessages, messagesOverview);
        }
        if (selectedIndex !== null) {
          setSelected(nestedMessages[selectedIndex]);
        }
      }
      return nestedMessages;
    },
  });
  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (!data)
    return (
      <span>
        <h1>Noch keine Nachrichten zu sehen.</h1>
        <p>
          Schreibe jemandem indem du auf einen Roadtrip klickst und dann auf
          "Nachricht senden".
        </p>
      </span>
    );

  if (!messagesOverview) return null;
  const rows = messagesOverview.map((message, i) => {
    const { otherUserName, startLand, startTown, destLand, destTown, text } =
      message;
    let customText = text;
    const cutLength = 100;
    if (customText.length > cutLength) {
      customText = text.substring(0, cutLength) + " ...";
    }
    return (
      <div
        className={selectedIndex === i ? "row selected" : "row"}
        onClick={() => handleClickFactory(i)(nestedMessages, messagesOverview)}
        key={`line-${message.id}`}
      >
        <h2>{otherUserName}</h2>

        <div className="date">
          {formatDateToLocal(message.created)}
          <br />
          <br />
          {!message.read ? <span className="dot"></span> : null}
        </div>

        <p>
          {startLand},{startTown} &#8594; {destLand},{destTown}
        </p>

        <p>{customText}</p>
      </div>
    );
  });
  return (
    <>
      {rows.length === 0 ? (
        <div id="table">
          <h1 className="nocontent">
            Du hast noch keine Nachrichten geschrieben
          </h1>
          <p className="nocontent">
            Gebe eine Nachricht unten in das Textfeld ein.
          </p>
        </div>
      ) : (
        <div id="table">{rows}</div>
      )}
      {selected ? <ChatMessages selected={selected} /> : null}
    </>
  );
}
