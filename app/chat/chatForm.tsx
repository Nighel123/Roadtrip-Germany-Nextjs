import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";

export default function ChatForm({
  roadtripID,
  otherUserID,
}: {
  roadtripID: string;
  otherUserID: number;
}) {
  const queryClient = useQueryClient();
  const [text, setText] = useState<string | null>(null);
  const session = useSession();
  const userID = session.data?.user?.id;
  if (!userID) return null;

  const mutation = useMutation({
    mutationFn: (newMessage: {
      text: string;
      from: number;
      to: number;
      roadtrip: string;
    }) => {
      return axios.post("api/chat", newMessage);
    },
    onSuccess: () => {
      // Invalidate and refetch
      console.log("success");
      setText(null);
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
  const handleTextChange = (e: any) => {
    setText(e.target.value);
  };

  return (
    <form
      id="sendForm"
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!text) return;
        const newMessage = {
          text: text,
          from: Number(userID),
          to: otherUserID,
          roadtrip: roadtripID,
        };
        mutation.mutate(newMessage);
      }}
    >
      <textarea
        name="text"
        onChange={handleTextChange}
        value={text ? text : ""}
      ></textarea>
      <input type="image" src="chat/send.png" alt="submit" />
    </form>
  );
}
