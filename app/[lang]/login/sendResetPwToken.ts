"use server";

import { z } from "zod";
import { ErrorCodes } from "../../../lib/definitions";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { sendResetPWToken } from "lib/mail/resetPwToken";

export async function sendPwResetToken(
  prevState: string[] | null,
  formData: FormData
) {
  const resetFormObj = Object.fromEntries(formData.entries()) as { email: any };
  const zEmail = z.object({
    email: z
      .string({ message: ErrorCodes.WRONG_CHARACTERS })
      .email({ message: ErrorCodes.WRONG_FORMAT }),
  });

  const parsedForm = zEmail.safeParse(resetFormObj);
  if (!parsedForm.success) {
    const errorObj = parsedForm.error.flatten(
      (issue) => issue.message
    ).fieldErrors;
    return errorObj.email || null;
  }

  const email = parsedForm.data.email;

  try {
    const {
      rows: [{ id: id, name: username, emailVerified: emailVerified }],
    } = await sql`
      SELECT id, name, emailVerified FROM users WHERE email = 'nickel.paulsen@gmail.com'
    `;

    if (!emailVerified) return ["UNVERIFIED"];

    if (!id) {
      return [ErrorCodes.NO_DATA];
    }

    await sql`
      DELETE FROM "password_reset_token" WHERE user_id = ${id}
    `;

    const {
      rows: [{ id: token }],
    } = await sql`
    INSERT INTO "password_reset_token" (user_id) 
    VALUES (${id})
    RETURNING id
  `;
    sendResetPWToken({ email, username, token });
  } catch (error) {
    console.error(error);
    return [ErrorCodes.SERVER_ERROR];
  }
  redirect("/newPassword/success");
}
