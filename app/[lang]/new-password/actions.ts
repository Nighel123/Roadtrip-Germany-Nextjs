"use server";

import { sql } from "@vercel/postgres";
import { ErrorCodes } from "lib/definitions";
import { zPassword, zUsername } from "lib/utils/validateRegisterForm";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function updateNewPassword(
  prevState: string[] | null,
  formData: FormData
) {
  const newPwObj = Object.fromEntries(formData.entries()) as {
    username: any;
    newPassword: any;
    token: any;
  };

  const zNewPw = z.object({
    token: z
      .string({
        message: ErrorCodes.WRONG_DATA,
      })
      .uuid({
        message: ErrorCodes.WRONG_DATA,
      }),
    newPassword: zPassword,
    username: zUsername,
  });

  const parsedNewPw = await zNewPw.safeParseAsync(newPwObj);

  if (!parsedNewPw.success) {
    //parsedNewPw.error?.format((issue) => issue.message).
    const errorObj = parsedNewPw.error?.flatten(
      (issue) => issue.message
    ).fieldErrors;

    return errorObj.newPassword?.length
      ? errorObj.newPassword
      : [ErrorCodes.SERVER_ERROR];
  }

  const { token, newPassword, username } = parsedNewPw.data;

  try {
    const {
      rows: [{ user_id: user_id, username: usernameDatabase }],
    } = await sql`
      SELECT user_id, users.name AS username
        FROM password_reset_token 
        JOIN users ON users.id = password_reset_token.user_id
        WHERE password_reset_token.id = ${token}
    `;

    if (username !== usernameDatabase) return [ErrorCodes.SERVER_ERROR];
    await sql`
      UPDATE users
        SET password = ${newPassword}
        WHERE id = ${user_id}
    `;

    await sql`
      DELETE FROM password_reset_token 
      WHERE password_reset_token.id = ${token} 
    `;
  } catch (error) {
    console.error(error);
    return [ErrorCodes.SERVER_ERROR];
  }
  redirect("/login");
}
