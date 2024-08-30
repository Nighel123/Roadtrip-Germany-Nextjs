import { Resend } from "resend";
import { ResetPwEmailTemplate } from "dictionaries/resetPwEmailTemplate";
import { getLocale } from "auth.config";
import { headers } from "next/headers";

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
  const resetLink = `${domain}/new-password/?token=${token}`;
  const lang = getLocale(headers());

  const { data, error } = await resend.emails.send({
    from: "reset-pw@roadtrip-germany.de",
    to: email,
    /* from: "onboarding@resend.dev",
    to: "nickel.paulsen@googlemail.com", */
    subject:
      lang === "en"
        ? `Renew password for ${username}`
        : `Passwort für ${username} erneuern`,
    react: ResetPwEmailTemplate({ username, resetLink, lang }),
  });
  if (error) {
    console.error("Mail Error: ", error);
    throw error;
  }
}
