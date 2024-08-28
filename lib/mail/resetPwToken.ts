import { Resend } from "resend";
import { ResetPwEmailTemplate } from "./resetPwEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export async function sendResetPWToken({
  username,
  token,
  email,
}: {
  username: string;
  token: string;
  email: string;
}) {
  const resetLink = `${domain}/newPassword/?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "reset-pw@roadtrip-germany.de",
    to: email,
    /* from: "onboarding@resend.dev",
    to: "nickel.paulsen@googlemail.com", */
    subject: `Reset password for ${username}`,
    react: ResetPwEmailTemplate({ username, resetLink }),
  });
  if (error) {
    console.error("Mail Error: ", error);
    throw error;
  }
}
