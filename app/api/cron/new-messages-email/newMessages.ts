import { CreateEmailResponseSuccess, Resend } from "resend";
import { NewMessagesTemplate } from "../../../../dictionaries/NewMessagesEmailTemplate";
import { getUsersWithUnreadEmails } from "lib/data/users";
import { setMessagesToInformed } from "lib/data/messages";
import { rejects } from "node:assert";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewMessagesEmail({
  recipientName,
  email,
  text,
  senderName,
  lang,
}: {
  recipientName: string;
  email: string;
  text: string;
  senderName: string;
  lang: "en" | "de";
}) {
  //throw new Error("mail error thrown");
  const { data, error } = await resend.emails.send({
    from: "newMessages@roadtrip-germany.de",
    to: email,
    /* from: "onboarding@resend.dev",
    to: "nickel.paulsen@googlemail.com", */
    subject:
      lang === "en"
        ? `Hello ${recipientName}, new messages for you from ${senderName}`
        : `Hallo ${recipientName}, es gibt neue Nachricten von ${senderName}`,
    react: NewMessagesTemplate({ recipientName, senderName, text, lang }),
  });

  if (error) {
    console.error("Mail Error: ", error);
    throw error;
  }
  return data;
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
  const promiseArr: Promise<CreateEmailResponseSuccess | null>[] = [];
  redArr.forEach((o, i) => {
    const prom: Promise<CreateEmailResponseSuccess | null> = new Promise(
      (resolve, reject) =>
        setTimeout(() => {
          const data = sendNewMessagesEmail(o);
          if (data) {
            resolve({ ...data, ...o });
          } else {
            reject();
          }
        }, i * intervall)
    );
    promiseArr.push(prom);
  });
  return promiseArr;
}
