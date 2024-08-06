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
import { FormEvent, useState } from "react";

export default function ChatMessages({
  selected,
}: {
  selected: MessagesDisplay[];
}) {
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
    </>
  );
}
