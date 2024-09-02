import { sendNewMessagesEmails } from "./newMessages";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const promArr = await sendNewMessagesEmails();
    const values = await Promise.all(promArr);
    return NextResponse.json(values, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 200 });
  }
}
