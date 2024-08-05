"use client";
import MessageDisplayer from "./massagesDisplayer";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { MessagesDisplay } from "app/lib/definitions";
import { Suspense, useState } from "react";
import MessagesTable from "./massagesTable";

export default function MessagesContainer(/* {
  messages,
}: {
  messages: MessagesDisplay[];
} */) {
  /* const userId = (await auth())?.user?.id;
  if (userId!) return null; */
  const queryClient = new QueryClient();

  const [selected, setSelected] = useState<MessagesDisplay[] | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <div id="messageContainer">
        <MessagesTable setSelected={setSelected} />
        <MessageDisplayer selected={selected} />
      </div>
    </QueryClientProvider>
  );
}
