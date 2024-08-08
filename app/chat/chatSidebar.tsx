"use client";

import { MessagesDisplay } from "app/lib/definitions";
import {
  formatDateToLocal,
  nestMessageArrayByOtherUserId,
  nestMessagesToOverviewMessages,
} from "app/lib/utils";
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
      if (!nestedMessages) return;
      if (!messagesOverview) return;
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
  const session = useSession();
  const userID = session.data?.user?.id;
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["messages", userID],
    queryFn: async () => {
      if (!userID) return [];
      const response = await fetch(`api/chat?id=${userID}`);
      if (!response.ok) {
        throw new Error(
          "Network response for fetching users messages was not ok"
        );
      }
      const { data: messages } = (await response.json()) as {
        data: MessagesDisplay[];
      };
      const nestedMessages = nestMessageArrayByOtherUserId(messages);
      const messagesOverview = nestMessagesToOverviewMessages(
        nestedMessages,
        userID
      );
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

  if (!data || data.length === 0) return <span>No messages yet to see.</span>;

  if (!messagesOverview) return null;
  const rows = messagesOverview.map((message, i) => {
    const { otherUserName, startLand, startTown, destLand, destTown, text } =
      message;
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

        <p>{text}</p>
      </div>
    );
  });
  return (
    <>
      <div id="table">{rows}</div>
      {selected ? <ChatMessages selected={selected} /> : null}
    </>
  );
}
