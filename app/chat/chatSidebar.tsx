"use client";

import { MessagesDisplay } from "app/lib/definitions";
import {
  formatDateToLocal,
  nestMessageArrayByOtherUserId,
  nestMessagesToOverviewMessages,
} from "app/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
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
  const handleClickFactory = (index: number) => {
    return (nestedMessages: MessagesDisplay[][] | null) => {
      if (!nestedMessages) return;
      setSelectedIndex(index);
      const messages = nestedMessages[index];
      setSelected(messages);
      const roadtripID = messages[0].roadtripId;
      setRoadtripID(roadtripID);
      const otherUserID = messages[0].otherUserId;
      setOtherUserID(otherUserID);
    };
  };
  const { data: session } = useSession();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const response = await fetch(`api/chat?id=${session?.user?.id}`);
      if (!response.ok) {
        throw new Error(
          "Network response for fetching users messages was not ok"
        );
      }
      const { data: messages } = (await response.json()) as {
        data: MessagesDisplay[];
      };
      const nestedMessages = nestMessageArrayByOtherUserId(messages);
      const messagesOverview = nestMessagesToOverviewMessages(nestedMessages);
      setNestedMessages(nestedMessages);
      if (search && selectedIndex === null) {
        const index = messagesOverview.findIndex(
          (message) => message.roadtripId === search
        );
        setRoadtripID(search);
        if (index !== -1) {
          // roadtrip was found in messages
          setSelectedIndex(index);
          setSelected(nestedMessages[index]);
        }
      } else {
        if (selectedIndex === null) {
          handleClickFactory(0)(nestedMessages);
        }
        if (selectedIndex !== null) {
          setSelected(nestedMessages[selectedIndex]);
        }
      }
      return messagesOverview;
    },
  });
  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (!data) return <span>No messages yet to see.</span>;

  const messagesOverview = data;

  const rows = messagesOverview.map((message, i) => {
    const { otherUserName, startLand, startTown, destLand, destTown, text } =
      message;
    return (
      <div
        className={selectedIndex === i ? "row selected" : "row"}
        onClick={() => handleClickFactory(i)(nestedMessages)}
        key={`line-${message.id}`}
      >
        <h2>{otherUserName}</h2>
        <div className="date">{formatDateToLocal(message.created)}</div>
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
