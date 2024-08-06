"use client";
import Image from "next/image";
import Link from "next/link";
import MessagesTable from "./massagesTable";
import { Suspense, useState } from "react";
import { MapSkeleton, TableSkeleton } from "app/ui/skeletons";
import MapWrapper from "app/ui/mapWrapper";

import "@/styles/chat.css";

import { Metadata } from "next";
import MessagesContainer from "./massagesContainer";
import { fetchMessagesByUserId } from "app/lib/data";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MessagesDisplay } from "app/lib/definitions";

/* export const metadata: Metadata = {
  title: "Roadtrip Chat",
}; */

export default function Chat() {
  //const messages = await fetchMessagesByUserId(/* userId */);
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <MessagesContainer />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
