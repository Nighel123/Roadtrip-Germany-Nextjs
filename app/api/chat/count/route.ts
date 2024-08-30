import {
  fetchMessagesByUserId,
  fetchNewMessagesCountByUserId,
  insertMessage,
} from "lib/data/messages";
import { auth } from "auth";

export async function GET(request: Request) {
  const userId = (await auth())?.user?.id;
  const data = await fetchNewMessagesCountByUserId(userId);

  return Response.json(data);
}
