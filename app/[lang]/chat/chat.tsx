"use client";

import "@/styles/chat.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ChatHeading from "./chatHeading";
import { SessionProvider } from "next-auth/react";

/* export const metadata: Metadata = {
  title: "Roadtrip Chat",
}; */

export default function Chat() {
  //const messages = await fetchMessagesByUserId(/* userId */);
  const queryClient = new QueryClient();
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ChatHeading />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
