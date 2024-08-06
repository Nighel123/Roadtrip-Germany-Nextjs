import { fetchMessagesByUserId, insertMessage } from "app/lib/data";
import { auth } from "auth";

export async function GET(request: Request) {
  /* const res = await fetch("https://data.mongodb-api.com/...", {
    headers: {
      "Content-Type": "application/json",
      "API-Key": process.env.DATA_API_KEY,
    },
  });
  
  const data = await res.json(); */
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return null;
  const session = await auth();
  if (id !== session?.user?.id) return null;
  const data = await fetchMessagesByUserId(id);

  return Response.json({ data });
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
