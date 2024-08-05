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
} from "@tanstack/react-query";
import axios from "axios";
import { FormEvent } from "react";

export default function MessageDisplayer({
  selected,
}: {
  selected: MessagesDisplay[] | null;
}) {
  if (!selected)
    return (
      <div id="messageDisplay">
        <p>No Message yet selected.</p>
      </div>
    );
  const {
    otherUserName,
    startLand,
    startTown,
    destLand,
    destTown,
    roadtripImageURL,
    roadtripCreatorId,
    otherUserId,
    roadtripId,
  } = selected[0];

  const roadtripUserName =
    roadtripCreatorId === 7 ? "Nighel1234" : otherUserName;
  const roadtrip = {
    startland: startLand,
    starttown: startTown,
    destland: destTown,
    desttown: destTown,
    username: roadtripUserName,
  } as unknown as RoadtripDisplay;

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

  return (
    <div id="messageDisplay">
      <div id="routeInfo">
        <MapLoader>
          <MyMapComponent roadtrips={[roadtrip]} />
        </MapLoader>
        <Image
          src={roadtripImageURL}
          alt="roadtripPicture"
          width={150}
          height={300}
        />
        <h1 className="name">{otherUserName}</h1>
        <p>
          {startLand},{startTown} &#8594; {destLand},{destTown}
        </p>
      </div>
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
    </div>
  );
}
