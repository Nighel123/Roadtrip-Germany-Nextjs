export async function GET(request: Request) {
  return Response.json(nestedMessagesSorted as MessagesDisplay[][]);
}
