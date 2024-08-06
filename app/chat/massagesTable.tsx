"use client";

import { fetchMessagesByUserId } from "app/lib/data";
import { auth } from "auth";
import { MessagesDisplay } from "app/lib/definitions";
import {
  formatDateToLocal,
  nestMessageArrayByOtherUserId,
  nestMessagesToOverviewMessages,
} from "app/lib/utils";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";

export default function MessagesTable(
  {
    setSelected,
    selectedIndex,
    setHeadingInfo,
    setSelectedIndex,
  }: {
    setSelected: (value: SetStateAction<MessagesDisplay[] | null>) => void;
    setHeadingInfo: Dispatch<SetStateAction<MessagesDisplay | null>>;
    selectedIndex: number | null;
    setSelectedIndex: Dispatch<SetStateAction<number | null>>;
  } /* {
    messagesOverview,
    handleClickFactory,
  }: {
    messagesOverview: MessagesDisplay[];
    handleClickFactory: (index: number) => () => void;
  } */
) {
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
      setSelected(nestedMessages[index]);
      setHeadingInfo(nestedMessages[index][0]);
      setSelectedIndex(index);
    };
  };
  const [messagesOverview, nestedMessages] = data;
  const rows = messagesOverview.map((message, i) => {
    const { otherUserName, startLand, startTown, destLand, destTown, text } =
      message;
    return (
      <div
        className="row"
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
  return <div id="table">{rows}</div>;
}
