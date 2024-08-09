"use client";


import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

//TODO: make Message counter client side, to update it more frequently.

export default function NewMessageCounter() {
    const queryClient = new QueryClient();
  return (
        <QueryClientProvider client={queryClient}>
      <Counter />
      </QueryClientProvider>
  );
}

function Counter() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["counter"],
    queryFn: async () => {
      const response = await fetch(`api/chat/count`);
      if (!response.ok) {
        throw new Error(
          "Network response for fetching the messages-count not ok"
        );
      }
      const { data: count } = (await response.json()) as {
        data: string;
      };

    }
}

/* export async function NewMessageCounter() {
  const session = await auth();
  const userID = session?.user?.id;
  if (!userID) return;
  const count = (await fetchNewMessagesCountByUserId(userID)) as string;
  return <>{Number(count) ? <p id="newMessageCounter">{count}</p> : null}</>;
} */
