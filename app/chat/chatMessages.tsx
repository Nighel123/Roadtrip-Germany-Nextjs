import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessagesDisplay, RoadtripDisplay } from "lib/definitions";
import { sortMessages } from "lib/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

export default function ChatMessages({
  selected,
}: {
  selected: MessagesDisplay[];
}) {
  const session = useSession();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const userID = session.data?.user?.id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      block: "nearest",
    });
  };

  const mutation = useMutation({
    mutationFn: (o: { from: number; roadtripId: string }) => {
      return axios.post("api/chat/update", o);
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      if (data.data) queryClient.invalidateQueries({ queryKey: ["messages"] });
      scrollToBottom();
    },
  });
  useEffect(() => {
    const message = selected[0];
    const otherUserID = message.otherUserId;
    mutation.mutate({
      from: otherUserID,
      roadtripId: message.roadtripId,
    });
  }, [selected]);

  const sorted = sortMessages(selected);
  let rows = sorted.map((message) => {
    return (
      <div
        key={`sorted-${message.id}`}
        className={message.from === Number(userID) ? "me" : "other"}
      >
        {message.text}
      </div>
    );
  });

  return (
    <>
      <div id="messages">
        {rows}
        <div ref={messagesEndRef} id="scrollElement" />
      </div>
    </>
  );
}
