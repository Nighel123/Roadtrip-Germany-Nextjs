import { MessagesDisplay } from "app/lib/definitions";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FormEvent } from "react";

export default function ChatForm({ heading }: { heading: MessagesDisplay }) {
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
  const { otherUserId, roadtripId } = heading;

  return (
    <form
      id="sendForm"
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newMessage = {
          text: "Hallo, ich bin cool Nr.2",
          from: 7,
          to: otherUserId,
          roadtrip: roadtripId,
        };
        mutation.mutate(newMessage);
      }}
    >
      <textarea></textarea>
      <input type="image" src="chat/send.png" alt="submit" />
    </form>
  );
}
