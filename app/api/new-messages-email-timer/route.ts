import { sendNewMessagesEmails } from "lib/mail";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  sendNewMessagesEmails(0);
  return new NextResponse("OK", {
    status: 200,
  });
}
