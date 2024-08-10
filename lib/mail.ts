import { Resend } from "resend";
import { EmailTemplate } from "ui/emailTemplate";

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
