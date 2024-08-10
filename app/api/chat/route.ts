import { fetchMessagesByUserId, insertMessage } from "lib/data";
import { MessagesDisplay } from "lib/definitions";
import {
  nestMessageArrayByOtherUserId,
  nestMessagesToOverviewMessages,
} from "lib/utils";
import { auth } from "auth";

export async function GET(request: Request) {
  const userId = (await auth())?.user?.id;
  if (!userId) return Response.json([[], []]);
  const messages = await fetchMessagesByUserId(userId);
  const nestedMessages = nestMessageArrayByOtherUserId(messages);
  const messagesOverview = nestMessagesToOverviewMessages(
    nestedMessages,
    userId
  );

  return Response.json([messagesOverview, nestedMessages] as [
    MessagesDisplay[],
    MessagesDisplay[][]
  ]);
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
