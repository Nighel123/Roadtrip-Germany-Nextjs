import { updateReadStatus } from "app/lib/data";

export async function POST(req: Request) {
  const obj = await req.json();
  const res = await updateReadStatus(obj);

  return Response.json(res);
}
