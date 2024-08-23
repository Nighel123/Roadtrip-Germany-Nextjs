import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessagesDisplay } from "lib/definitions";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export default function ChatMessages({
  selected,
}: {
  selected: MessagesDisplay[];
}) {
  const session = useSession();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const userID = session.data?.user?.id;
  //const [scroll, setScroll] = useState(true);

  /* const [isVisible, setIsVisible] = useState(false); */

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ block: "nearest" });
  };

  const mutation = useMutation({
    mutationFn: (o: { from: number; roadtripId: string }) => {
      return axios.post("/api/chat/update", o);
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      if (data.data) {
        queryClient.invalidateQueries({ queryKey: ["messages"] });
      }
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

  useEffect(() => {
    if (messagesEndRef.current) scrollToBottom();
  }, [messagesEndRef.current]);

  const endIndex = selected.length - 1;
  const rows = selected.map((message, index) => {
    return (
      <>
        <div
          key={`sorted-${message.id}`}
          className={message.from === Number(userID) ? "me" : "other"}
        >
          {message.text}
        </div>
        {index === endIndex ? (
          <div
            ref={messagesEndRef}
            id="scrollElement"
            key={`scrollIntoViewElement-${message.id}`}
          ></div>
        ) : null}
      </>
    );
  });

  return (
    <>
      <div id="messages">{rows}</div>
    </>
  );
}
