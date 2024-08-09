import {
  fetchMessagesByUserId,
  fetchNewMessagesCountByUserId,
  insertMessage,
} from "app/lib/data";
import { auth } from "auth";

export async function GET(request: Request) {
  const userId = (await auth())?.user?.id;
  if (!userId) return null;
  const data = await fetchNewMessagesCountByUserId(userId);

  return Response.json(data);
}
