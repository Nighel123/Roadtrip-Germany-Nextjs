"use server";

import { db } from "@vercel/postgres";
import { redirect } from "next/navigation";
import { ZodIssue } from "zod";
import {
  FormDataErrors,
  formatErrors,
  error,
} from "lib/utils/validateInsertForm";
import {
  formatRegisterData,
  zRegisterForm,
} from "lib/utils/validateRegisterForm";

import { RegisterForm } from "lib/definitions";
import { sendVerificationEmail } from "app/[lang]/register/verificationLink";
import { generateVerificationToken } from "lib/data/users";
import { getLocale } from "auth.config";
import { headers } from "next/headers";

export async function register(
  prevState: error[],
  formData: FormData
): Promise<error[]> {
  const submit = formData.get("submit");
  const formDataObj = Object.fromEntries(
    formData.entries()
  ) as RegisterForm<any>;
  const formatedDataObj = formatRegisterData(formDataObj);
  const resFormDataObj = await zRegisterForm.safeParseAsync(formatedDataObj);

  if (!resFormDataObj.success) {
    const errorObj = formatErrors(
      resFormDataObj.error?.flatten((issue: ZodIssue) => ({
        path: issue.path,
        message: issue.message,
      })) as FormDataErrors
    );
    return errorObj;
  }
  if (!submit)
    return [
      {
        message: "",
        path: ["database"],
      },
    ];

  const { username, email, password, birthday, sex } = resFormDataObj.data;

  const client = await db.connect();
  const lang = getLocale(headers());
  try {
    await client.sql`BEGIN`; // start a transaction
    const {
      rows: [{ id: user_id }],
    } = await client.sql`
        INSERT INTO users (name, email, password, birthday,sex, lang)  
        VALUES (${username}, ${email}, ${password},${birthday.Date.toISOString()}, ${sex}, ${lang})
        RETURNING id`;

    const token = await generateVerificationToken({
      user_id: user_id,
      client: client,
    });
    await sendVerificationEmail(username, email, token);
  } catch (error) {
    console.log(error);
    await client.sql`ROLLBACK`; // rollback the transaction
    return [
      {
        message: `Der Nutzer konnte nicht erstellt werden: ${error}`,
        path: ["submit"],
      },
    ];
  }
  await client.sql`COMMIT`; // commit the transaction
  redirect("/success/registered");
}
