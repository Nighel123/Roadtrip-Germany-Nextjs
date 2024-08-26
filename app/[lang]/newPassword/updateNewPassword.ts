import { sql } from "@vercel/postgres";
import { ErrorCodes } from "lib/definitions";
import { zPassword } from "lib/utils/validateRegisterForm";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function updateNewPassword(prevState: string, formData: FormData) {
  const newPwObj = Object.fromEntries(formData.entries()) as {
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
  });

  const parsedNewPw = zNewPw.safeParse(newPwObj);

  if (!parsedNewPw.success) {
    return parsedNewPw.error?.flatten((issue) => issue.message).formErrors;
  }

  const { token, newPassword } = parsedNewPw.data;

  try {
    const {
      rows: [{ user_id: user_id }],
    } = await sql`
      SELECT user_id FROM password_reset_token WHERE id = ${token}
    `;

    await sql`
      UPDATE users
        SET password = ${newPassword}
        WHERE id = ${user_id}
    `;
  } catch (error) {
    console.error(error);
    return [ErrorCodes.SERVER_ERROR];
  }
  redirect("/login");
}
