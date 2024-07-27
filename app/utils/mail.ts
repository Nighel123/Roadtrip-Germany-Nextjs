import { generateVerificationToken } from "app/lib/actions";
import { Resend } from "resend";
import { EmailTemplate } from "app/ui/emailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export async function sendVerificationEmail(
  username: string,
  email: string,
  user_id: string
) {
  const token = await generateVerificationToken(user_id);
  const confirmLink = `${domain}/login/?verification_token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "validateEmail@roadtrip-germany.de",
    to: email,
    subject: `Hello ${username}, confirm existance of ${email}`,
    react: EmailTemplate({ username, email, confirmLink }),
  });

  if (error) {
    console.error("Mail Error: ", error);
  }
  console.log(data);
}
