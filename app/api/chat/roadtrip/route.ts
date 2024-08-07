import { fetchRoadtripById } from "app/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return null;
  const data = await fetchRoadtripById(id);

  return Response.json(data);
}
