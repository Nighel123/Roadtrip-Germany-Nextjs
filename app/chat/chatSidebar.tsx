"use client";

import { fetchMessagesByUserId } from "app/lib/data";

import { MessagesDisplay } from "app/lib/definitions";
import {
  formatDateToLocal,
  nestMessageArrayByOtherUserId,
  nestMessagesToOverviewMessages,
} from "app/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import ChatMessages from "./chatMessages";

export default function ChatSidebar({
  setHeading,
}: {
  setHeading: Dispatch<SetStateAction<MessagesDisplay | null>>;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<MessagesDisplay[] | null>(null);
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const response = await fetch("api/chat" /* +userId */);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const { data: messages } = (await response.json()) as {
        data: MessagesDisplay[];
      };
      const nestedMessages = nestMessageArrayByOtherUserId(messages);
      const messagesOverview = nestMessagesToOverviewMessages(nestedMessages);
      if (selectedIndex !== null) {
        setSelected(nestedMessages[selectedIndex]);
      }
      return [messagesOverview, nestedMessages] as [
        MessagesDisplay[],
        MessagesDisplay[][]
      ];
    },
  });
  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (!data) return <span>No messages yet to see.</span>;
  const handleClickFactory = (index: number) => {
    return () => {
      setHeading(nestedMessages[index][0]);
      setSelectedIndex(index);
      setSelected(nestedMessages[index]);
    };
  };
  const [messagesOverview, nestedMessages] = data;
  const rows = messagesOverview.map((message, i) => {
    const { otherUserName, startLand, startTown, destLand, destTown, text } =
      message;
    return (
      <div
        className={selectedIndex === i ? "row selected" : "row"}
        onClick={handleClickFactory(i)}
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
