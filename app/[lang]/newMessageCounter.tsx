"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";

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
  const [count, setCount] = useState<string>("0");
  const { isPending, isError, data } = useQuery({
    queryKey: ["counter"],
    refetchInterval: 10000,
    queryFn: async () => {
      const response = await fetch(`/api/chat/count`);
      if (!response.ok) {
        throw new Error(
          "Network response for fetching the messages-count not ok"
        );
      }
      const count = (await response.json()) as string;

      setCount(count);
      return count;
    },
  });
  if (isPending) {
    return null;
  }

  if (isError) {
    return null;
  }

  if (!data) return null;

  return <>{Number(count) ? <p id="newMessageCounter">{count}</p> : null}</>;
}
