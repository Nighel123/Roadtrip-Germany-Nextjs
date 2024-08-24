import { getUsersWithUnreadEmails, setMessagesToInformed } from "lib/data";
import { sendNewMessagesEmail } from "lib/mail";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  setTimeout(async () => {
    const emailArray = await getUsersWithUnreadEmails();
    emailArray.reduce((acc, curr) => {
      if (
        acc.some(
          ({ senderName, email }) =>
            senderName == curr.senderName && email == curr.email
        )
      ) {
        return acc;
      } else {
        acc.push(curr);
      }
      return acc;
    }, [] as typeof emailArray);
    emailArray.forEach(async (o) => {
      await sendNewMessagesEmail(o);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    await setMessagesToInformed();
  }, 120000);
  return new NextResponse("OK", {
    status: 200,
  });
}
