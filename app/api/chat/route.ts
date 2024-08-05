import { fetchMessagesByUserId, insertMessage } from "app/lib/data";

export async function GET() {
  /* const res = await fetch("https://data.mongodb-api.com/...", {
    headers: {
      "Content-Type": "application/json",
      "API-Key": process.env.DATA_API_KEY,
    },
  });
  
  const data = await res.json(); */

  const data = await fetchMessagesByUserId();

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
