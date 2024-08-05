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
import { SetStateAction, useEffect } from "react";

export default function MessagesTable(
  {
    setSelected,
  }: {
    setSelected: (value: SetStateAction<MessagesDisplay[] | null>) => void;
  } /* {
  messagesOverview,
}: {
  messagesOverview: MessagesDisplay[];
} */
) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      console.log("fetching messages 2");
      const response = await fetch("api/chat" /* +userId */);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
  /*   useEffect(() => {
    console.log("messages changed");
  }, [data]); */
  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (!data) return <span>No messages yet to see.</span>;
  const { data: messages } = data;

  const nestedMessages = nestMessageArrayByOtherUserId(messages);
  const messagesOverview = nestMessagesToOverviewMessages(nestedMessages);

  const handleClickFactory = (index: number) => {
    return () => setSelected(nestedMessages[index]);
  };

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
