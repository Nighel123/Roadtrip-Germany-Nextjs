import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Dict } from "../dictionaries";
import { sendNewMessageEmail } from "lib/actions";

export default function ChatForm({
  roadtripID,
  otherUserID,
  dict,
}: {
  roadtripID: string;
  otherUserID: number;
  dict: Dict;
}) {
  const { chatForm } = dict.chat;
  const queryClient = useQueryClient();
  const [text, setText] = useState<string | null>(null);
  const session = useSession();
  const userID = session.data?.user?.id;

  useEffect(() => {
    return () => {
      fetch(`/api/new-messages-email`);
    };
  }, []);

  const mutation = useMutation({
    mutationFn: (newMessage: {
      text: string;
      from: number;
      to: number;
      roadtrip: string;
    }) => {
      return axios.post("/api/chat", newMessage);
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
  if (!userID) return null;

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
      <input type="image" src={chatForm.send} alt="submit" />
    </form>
  );
}
