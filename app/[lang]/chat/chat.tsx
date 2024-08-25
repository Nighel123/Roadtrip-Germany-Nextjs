"use client";

import "@/styles/chat.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ChatHeading from "./chatHeading";
import { SessionProvider } from "next-auth/react";
import { Dict } from "../dictionaries";
import { Suspense, useEffect } from "react";

/* export const metadata: Metadata = {
  title: "Roadtrip Chat",
}; */

export default function Chat({ dict }: { dict: Dict }) {
  //const messages = await fetchMessagesByUserId(/* userId */);
  const queryClient = new QueryClient();
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense>
          <ChatHeading dict={dict} />
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
