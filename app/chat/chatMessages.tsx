import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessagesDisplay, RoadtripDisplay } from "app/lib/definitions";
import { sortMessages } from "app/lib/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function ChatMessages({
  selected,
}: {
  selected: MessagesDisplay[];
}) {
  const session = useSession();
  const userID = session.data?.user?.id;
  if (!userID) return null;

  const mutation = useMutation({
    mutationFn: (o: { from: number; to: number; roadtripId: string }) => {
      return axios.post("api/chat/update", o);
    },
    onSuccess: () => {
      // Invalidate and refetch
      //queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
  useEffect(() => {
    const message = selected[0];
    const otherUserID =
      Number(userID) === message.from ? message.to : message.from;
    mutation.mutate({
      from: otherUserID,
      to: Number(userID),
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
      <div id="messages">{rows}</div>
    </>
  );
}
