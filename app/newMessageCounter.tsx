"use client";

import { auth } from "auth";
import { fetchNewMessagesCountByUserId } from "./lib/data";
import { SessionProvider, useSession } from "next-auth/react";
import { QueryClient, useQuery } from "@tanstack/react-query";

//TODO: make Message counter client side, to update it more frequently.

export default function NewMessageCounter() {
    const queryClient = new QueryClient();
  return (
    <SessionProvider client={queryClient}>
      <Counter />
    </SessionProvider>
  );
}

function Counter() {
  const userID = useSession().data?.user?.id;
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["messages", userID],
    queryFn: async () => {
      if (!userID) return [];
      const response = await fetch(`api/chat?id=${userID}`);
      if (!response.ok) {
        throw new Error(
  return null;
}

/* export async function NewMessageCounter() {
  const session = await auth();
  const userID = session?.user?.id;
  if (!userID) return;
  const count = (await fetchNewMessagesCountByUserId(userID)) as string;
  return <>{Number(count) ? <p id="newMessageCounter">{count}</p> : null}</>;
} */
