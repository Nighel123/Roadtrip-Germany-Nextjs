import { Resend } from "resend";
import { NewMessagesTemplate } from "./NewMessagesEmailTemplate";
import { getUsersWithUnreadEmails } from "../data/users";
import { setMessagesToInformed } from "lib/data/messages";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewMessagesEmail({
  recipientName,
  email,
  text,
  senderName,
}: {
  recipientName: string;
  email: string;
  text: string;
  senderName: string;
}) {
  //throw new Error("mail error thrown");
  const { data, error } = await resend.emails.send({
    from: "newMessages@roadtrip-germany.de",
    to: email,
    /* from: "onboarding@resend.dev",
    to: "nickel.paulsen@googlemail.com", */
    subject: `Hello ${recipientName}, new messages for you from ${senderName}`,
    react: NewMessagesTemplate({ recipientName, senderName, text }),
  });

  if (error) {
    console.error("Mail Error: ", error);
    throw error;
  }
  //console.log(data);
}

export async function sendNewMessagesEmails() {
  const emailArray = await getUsersWithUnreadEmails();
  const redArr = emailArray.reduce((acc, curr) => {
    if (
      acc.some(
        ({ email, senderName }) =>
          email == curr.email && senderName == curr.senderName
      ) ||
      new Date().valueOf() - new Date(curr.messageCreated).valueOf() < 600000
    ) {
      return acc;
    } else {
      acc.push(curr);
    }
    return acc;
  }, [] as typeof emailArray);
  const intervall = 500;
  redArr.forEach((o, i) => {
    setTimeout(() => sendNewMessagesEmail(o), i * intervall);
  });
  await setMessagesToInformed();
}
