import { fetchMessagesByUserId, insertMessage } from "lib/data";
import { MessagesDisplay } from "lib/definitions";
import {
  nestMessageArrayByOtherUserId,
  sortNestedMessages,
} from "lib/utils/utils";
import { auth } from "auth";

export async function GET(request: Request) {
  const userId = (await auth())?.user?.id;
  if (!userId) return Response.json([[], []]);
  const messages = await fetchMessagesByUserId(userId);
  const nestedMessages = nestMessageArrayByOtherUserId(messages);
  const nestedMessagesSorted = sortNestedMessages(nestedMessages);

  return Response.json(nestedMessagesSorted as MessagesDisplay[][]);
}

export async function POST(req: Request) {
  /* const res = await fetch("https://data.mongodb-api.com/...", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-Key": process.env.DATA_API_KEY!,
    },
    body: JSON.stringify({ time: new Date().toISOString() }),
  });

  const data = await res.json(); */
  const newMessage = await req.json();
  const res = await insertMessage(newMessage);

  return Response.json(res);
}
