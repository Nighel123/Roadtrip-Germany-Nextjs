"use client";

import "@/styles/chat.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ChatHeading from "./chatHeading";

/* export const metadata: Metadata = {
  title: "Roadtrip Chat",
}; */

export default function Chat() {
  //const messages = await fetchMessagesByUserId(/* userId */);
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ChatHeading />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
