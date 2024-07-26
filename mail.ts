import { generateVerificationToken } from "app/lib/actions";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export async function sendVerificationEmail(email: string, user_id: string) {
  const token = await generateVerificationToken(user_id);
  const confirmLink = `${domain}/login/?verification_token=${token}`;

  const lol = await resend.emails.send({
    from: "validateEmail@roadtrip-germany.de",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
  /* console.log("email sent to: ", email); */
  /* console.log({ lol }); */
}
