"use server";

import { z } from "zod";
import { ErrorCodes } from "../../../lib/definitions";
import { sql } from "@vercel/postgres";

export async function sendPwResetToken(
  prevState: string | undefined,
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
    return parsedForm.error.flatten((issue) => issue.message);
  }

  const {
    rows: [{ id: id }],
  } = await sql`
      SELECT id FROM users WHERE email = 'nickel.paulsen@gmail.com')
    `;

  if (!id) {
    return ErrorCodes.NO_DATA;
  }

  const {
    rows: [{ id: _id }],
  } = await sql`
    INSERT INTO "password_reset_token" (user_id) 
    VALUES (${id})
    RETURNING id
  `;
}
