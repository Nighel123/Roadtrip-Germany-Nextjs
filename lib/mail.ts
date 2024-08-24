import { Resend } from "resend";
import { EmailTemplate, NewMessagesTemplate } from "ui/emailTemplate";
import { getUsersWithUnreadEmails, setMessagesToInformed } from "./data";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export async function sendVerificationEmail(
  username: string,
  email: string,
  token: `${string}-${string}-${string}-${string}-${string}`
) {
  const confirmLink = `${domain}/login/?verification_token=${token}`;

  //throw new Error("mail error thrown");
  const { data, error } = await resend.emails.send({
    from: "validateEmail@roadtrip-germany.de",
    to: email,
    /* from: "onboarding@resend.dev",
    to: "nickel.paulsen@googlemail.com", */
    subject: `Hello ${username}, confirm existance of ${email}`,
    react: EmailTemplate({ username, email, confirmLink }),
  });

  if (error) {
    console.error("Mail Error: ", error);
    throw error;
  }
  //console.log(data);
}

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
  emailArray.reduce((acc, curr) => {
    if (
      acc.some(
        ({ email }) =>
          /* senderName == curr.senderName &&  */ email == curr.email
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
}
