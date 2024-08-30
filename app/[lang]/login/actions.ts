"use server";

import { z } from "zod";
import { ErrorCodes, LoginForm } from "../../../lib/definitions";
import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { sendResetPWToken } from "app/[lang]/new-password/resetPwToken";
import { generateVerificationToken, getUserbyEmail } from "lib/data/users";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import { signIn } from "auth";
import { headers } from "next/headers";
import { getLocale } from "auth.config";
import { sendVerificationEmail } from "../register/verificationLink";

export async function SignIn(callbackUrl: string) {
  await signIn("google", { redirectTo: callbackUrl || "/" });
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  const LoginObj = Object.fromEntries(formData.entries()) as LoginForm<any>;

  const parsedCredentials = z
    .object({
      username: z.string(),
      password: z.string().min(6),
      callbackUrl: z.string(),
      verificationToken: z.string(),
    })
    .safeParse(LoginObj);

  if (!parsedCredentials.success) return ErrorCodes.WRONG_DATA;

  const { username, password, callbackUrl, verificationToken } =
    parsedCredentials.data;

  try {
    await signIn("credentials", {
      username: username,
      password: password,
      redirectTo: callbackUrl, // digested by the redirect callback in the
      verificationToken: verificationToken,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      //log(error);
      switch (error.type) {
        case "CredentialsSignin":
          return ErrorCodes.WRONG_DATA;
        case "CallbackRouteError":
          console.error(error);
          return ErrorCodes.SERVER_ERROR;
        default:
          return ErrorCodes.SERVER_ERROR;
      }
    }

    if (isRedirectError(error)) {
      // I guess it is not possible to prevet this error since it also happens in the tutorial!
      throw error;
    }
    //log({ error });
    throw error;
  }
}

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
      rows: [{ id: id, name: username }],
    } = await sql`
      SELECT id, name FROM users WHERE email = ${email}
    `;

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
  redirect("/success/new-password");
}

export async function resendVerification(
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
    const { user_id, username, emailVerified } = await getUserbyEmail(email);
    if (emailVerified) return [ErrorCodes.ALREADY_EXISTS];

    const token = await generateVerificationToken({ user_id: user_id });
    await sendVerificationEmail(username, email, token);
  } catch (error) {
    console.error(error);
    return [ErrorCodes.SERVER_ERROR];
  }
  redirect("/success/resend-validation");
}
