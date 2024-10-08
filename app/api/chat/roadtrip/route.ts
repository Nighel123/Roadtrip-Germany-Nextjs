import { fetchRoadtripById } from "lib/data/roadtrips";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const data = await fetchRoadtripById(id);

  return Response.json(data);
}
