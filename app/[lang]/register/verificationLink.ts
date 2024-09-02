import { Resend } from "resend";
import { VerificationEmailTemplate } from "../../../dictionaries/verificationEmailTemplate";
import { getLocale } from "middleware";
import { headers } from "next/headers";
import { getDictionary } from "../dictionaries";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export async function sendVerificationEmail(
  username: string,
  email: string,
  token: `${string}-${string}-${string}-${string}-${string}`
) {
  const confirmLink = `${domain}/login/?verification_token=${token}`;
  const lang = getLocale(headers());

  //throw new Error("mail error thrown");
  const { data, error } = await resend.emails.send({
    from: "validateEmail@roadtrip-germany.de",
    to: email,
    /* from: "onboarding@resend.dev",
    to: "nickel.paulsen@googlemail.com", */
    subject:
      lang === "en"
        ? `Hello ${username}, confirm existance of ${email}`
        : `Hallo ${username}, bitte bestätige die Existenz von ${email}`,
    react: VerificationEmailTemplate({ username, email, confirmLink, lang }),
  });

  if (error) {
    console.error("Mail Error: ", error);
    throw error;
  }
  //console.log(data);
}
