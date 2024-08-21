"use client";

import "@/styles/chat.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ChatHeading from "./chatHeading";
import { SessionProvider } from "next-auth/react";
import { Dict } from "../dictionaries";

/* export const metadata: Metadata = {
  title: "Roadtrip Chat",
}; */

export default function Chat({ dict }: { dict: Dict }) {
  //const messages = await fetchMessagesByUserId(/* userId */);
  const queryClient = new QueryClient();
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ChatHeading dict={dict} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
