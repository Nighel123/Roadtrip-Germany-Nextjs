import { getUsersWithUnreadEmails, setMessagesToInformed } from "lib/data";
import { sendNewMessagesEmail } from "lib/mail";

export async function GET() {
  const emailArray = await getUsersWithUnreadEmails();
  /* emailArray.reduce((acc, curr) => {
    acc.some(
      ({ sender, email }) => sender == curr.sender && email == curr.email
    ) ? return acc : 
    const array = [...acc];
    array.push(curr);
    return array;
  }, []); */
  emailArray.forEach((o) => {
    sendNewMessagesEmail(o);
  });
  await setMessagesToInformed();
}
