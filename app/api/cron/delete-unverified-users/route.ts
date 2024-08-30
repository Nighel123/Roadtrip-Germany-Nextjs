import { deleteUnverifiedUsers } from "lib/data/users";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  await deleteUnverifiedUsers();
  return new NextResponse("OK", {
    status: 200,
  });
}
