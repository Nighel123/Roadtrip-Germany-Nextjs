import MapLoader from "app/ui/mapLoader";
import MyMapComponent from "../ui/map";
import { MessagesDisplay, RoadtripDisplay } from "app/lib/definitions";
import Image from "next/image";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  UseMutationResult,
} from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { FormEvent } from "react";

export default function MessageDisplayer({
  selected,
}: {
  selected: MessagesDisplay[] | null;
}) {
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
  if (!selected) return null;
  const { otherUserId, roadtripId } = selected[0];

  let rows = selected.map((message) => {
    return (
      <div
        key={`selected-${message.id}`}
        className={message.from === 7 ? "me" : "other"}
      >
        {message.text}
      </div>
    );
  });

  return (
    <>
      <div id="messages">{rows}</div>
      <form
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
    </>
  );
}
