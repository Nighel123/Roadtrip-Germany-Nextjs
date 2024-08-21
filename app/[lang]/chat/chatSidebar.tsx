"use client";

import { MessagesDisplay } from "lib/definitions";
import {
  displayNestedArray,
  formatDateToLocal,
  getConversationHash,
  getHashArray,
  nestMessagesToOverviewMessages,
} from "lib/utils/utils";

import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ChatMessages from "./chatMessages";
import { useSearchParams } from "next/navigation";

import { useSession } from "next-auth/react";
import { Dict } from "../dictionaries";

export default function ChatSidebar({
  setRoadtripID,
  setOtherUserID,
  dict,
}: {
  setRoadtripID: Dispatch<SetStateAction<string | null>>;
  setOtherUserID: Dispatch<SetStateAction<number | null>>;
  dict: Dict;
}) {
  const { chat } = dict;
  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [conversationHash, setHash] = useState<string | null>(null);
  const [hashArray, setHashArray] = useState<string[] | null>(null);
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
      const hash = getConversationHash(messagesOverview[index]);
      setHash(hash);
      const messages = nestedMessages[index];
      setSelected(messages);
      const roadtripID = messages[0].roadtripId;
      setRoadtripID(roadtripID);
      const otherUserID = messages[0].otherUserId;
      setOtherUserID(otherUserID);
    };
  };
  const userId = useSession().data?.user?.id;

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["messages"],
    refetchInterval: 3000,
    queryFn: async () => {
      const response = await fetch(`/api/chat`);
      if (!response.ok) {
        throw new Error(
          "Network response for fetching users messages was not ok"
        );
      }
      const nestedMessages = (await response.json()) as MessagesDisplay[][];

      if (!userId) throw Error("no user defined");
      const messagesOverview = nestMessagesToOverviewMessages(
        nestedMessages,
        userId
      );
      const displayNestedMss = displayNestedArray(nestedMessages);
      const hashArray = getHashArray(messagesOverview);

      setHashArray(hashArray);
      setNestedMessages(displayNestedMss);
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
          let index: number;
          if (hashArray === null) {
            index = 0;
          } else {
            index = hashArray.findIndex((hash) => hash === conversationHash);
            if (index === -1) index = 0;
          }
          handleClickFactory(index)(nestedMessages, messagesOverview);
        }
      }
      return nestedMessages;
    },
  });
  if (isPending) {
    return <span className="queryStatus">{chat.queryStatus.loading}</span>;
  }

  if (isError) {
    console.log(error);
    return <span className="queryStatus">{chat.queryStatus.error}</span>;
  }

  if (!data)
    return (
      <span>
        <h1>{chat.dataStatus.noData.heading}</h1>
        <p>{chat.dataStatus.noData.paragraph}</p>
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
        onClick={() => {
          handleClickFactory(i)(nestedMessages, messagesOverview);
        }}
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
          {startLand}, {startTown} &#8594; {destLand}, {destTown}
        </p>

        <p>{customText}</p>
      </div>
    );
  });
  return (
    <>
      {rows.length === 0 && !search ? (
        <span className="queryStatus">
          <h1>{chat.dataStatus.noData.heading}</h1>
          <p>{chat.dataStatus.noData.paragraph}</p>
        </span>
      ) : (
        <div id="table">{rows}</div>
      )}
      {selected ? <ChatMessages selected={selected} /> : null}
    </>
  );
}
