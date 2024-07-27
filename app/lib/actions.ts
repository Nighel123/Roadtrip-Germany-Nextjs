"use server";

import { sql } from "@vercel/postgres";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodIssue, z } from "zod";
import { RoadtripForm, RegisterForm, LoginForm } from "./definitions";
import fs from "fs";
import {
  FormDataErrors,
  formatErrors,
  insertFormToZObj,
  zFormDataObj,
  error,
} from "app/insertRoadtrip/utils";
import { formatRegisterData, zRegisterForm } from "app/register/utils";
import { auth, signIn } from "auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import { sendVerificationEmail } from "mail";
import { randomUUID } from "node:crypto";
import path from "path";

const { log } = console;

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

  if (parsedCredentials.success) {
    const { username, password, callbackUrl, verificationToken } =
      parsedCredentials.data;

    try {
      /* const { url, status, ok, error } =  */ await signIn("credentials", {
        username: username,
        password: password,
        redirectTo: callbackUrl, // digested by the redirect callback in the
        verificationToken: verificationToken,
      });
      //redirect(url);
      //console.log(url);
      log("no errors");
    } catch (error) {
      if (error instanceof AuthError) {
        //log(error);
        switch (error.type) {
          case "CredentialsSignin":
            return "Invalid credentials.";
          case "CallbackRouteError":
            return error.cause?.err?.message;
          default:
            return "Something went wrong.";
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
}

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
    return formatErrors(
      resFormDataObj.error?.flatten((issue: ZodIssue) => ({
        path: issue.path,
        message: issue.message,
      })) as FormDataErrors
    );
  }
  if (!submit)
    return [
      {
        message: "",
        path: ["database"],
      },
    ];

  const { username, email, password, birthday, sex } = resFormDataObj.data;

  try {
    await sql`BEGIN`; // start a transaction
    const {
      rows: [{ id: user_id }],
    } = await sql`
        INSERT INTO users (name, email, password, birthday,sex)  
        VALUES (${username}, ${email}, ${password},${birthday.date}, ${sex})
        RETURNING id`;
    await sendVerificationEmail(email, user_id);
  } catch (error) {
    console.log(error);
    await sql`ROLLBACK`; // rollback the transaction
    return [
      {
        message: "Database Fehler: Benutzer konnte nicht erstellt werden.",
        path: ["database"],
      },
    ];
  }

  redirect("/register/success");
}
export async function insertRoadtrip(
  prevState: error[],
  formData: FormData
): Promise<error[]> {
  //throw new Error("Failed to insert Roadtrip");
  const submit = formData.get("submit");
  const formDataObj = Object.fromEntries(
    formData.entries()
  ) as RoadtripForm<any>;

  const formDataZObj = insertFormToZObj(formDataObj);
  // we have a mocked async AddressCheck function inside our validation.
  const resFormDataObj = await zFormDataObj.safeParseAsync(formDataZObj);

  if (!resFormDataObj.success) {
    //console.log(validatedFields);
    return formatErrors(
      resFormDataObj.error?.flatten((issue: ZodIssue) => ({
        path: issue.path,
        message: issue.message,
      })) as FormDataErrors
    );
  }

  const {
    description,
    file,
    route: { start, dest },
    date: { Date },
  } = resFormDataObj.data;
  // Test it out:

  if (!submit)
    return [
      {
        message: "",
        path: ["file"],
      },
    ];

  const user_id = (await auth())?.user?.id;

  try {
    await sql`BEGIN`; // start a transaction
    const {
      rows: [{ id: start_id }],
    } = await sql`
        INSERT INTO addresses (land, town)  
        VALUES (${start.land}, ${start.town})
        RETURNING id`;
    const {
      rows: [{ id: dest_id }],
    } = await sql`
        INSERT INTO addresses (land, town)  
        VALUES (${dest.land}, ${dest.town})
        RETURNING id`;
    var {
      rows: [{ id: imgName }],
    } = await sql`
        INSERT INTO roadtrips (user_id, start_id, dest_id, date, image_url, description)
        VALUES (${user_id},${start_id},${dest_id}, ${Date.toISOString()}, ${
      file.ext
    }, ${description})
        RETURNING id`;

    if (file) {
      /* const arrayBuffer = await file.File.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer); */

      /* await fs.mkdir("./uploads", { recursive: true }, (err) => {
        if (err) throw err;
      }); */

      const blob = await put(`${imgName}.${file.ext}`, file.File, {
        access: "public",
      });
      console.log(blob);
      await sql`
        UPDATE roadtrips 
        SET image_url = ${blob.downloadUrl} 
        WHERE id = ${imgName};
      `;

      /* const filePath = path.join(
        process.cwd(),
        `public/uploads/${imgName}.${file.ext}`
      );

      await fs.writeFile(filePath, buffer, async (err) => {
        console.log("fileupload: ", err);
        //throw new Error(`Error writing file: ${err}`);
      }); */
    } else {
      await sql`ROLLBACK`; // rollback the transaction
    }
    await sql`COMMIT`; // commit the transaction
  } catch (error) {
    console.log(error);
    await sql`ROLLBACK`; // rollback the transaction
    return [
      {
        message: `Roadtrip konnte nicht eingetragen werden. ${error}`,
        path: ["file"],
      },
    ];
  }
  revalidatePath("/insertRoadtrip");
  redirect("/routesOverview");
}

export async function generateVerificationToken(user_id: string) {
  const token = randomUUID();
  console.log("token", token);
  const expires = new Date(new Date().getTime() + 3600 * 1000).toISOString(); // expires in 1 hour

  try {
    await sql`
        INSERT INTO verification_token (identifier, expires, token, user_id)
        VALUES (uuid_generate_v4(), ${expires}, ${token}, ${user_id})
    `;
    return token;
  } catch (error) {
    console.error(error);
  }
}

export async function getVerificationTokenByUserIdAndToken(
  userId: string,
  token: string
) {
  try {
    return (
      await sql`
            SELECT * FROM verification_token 
            WHERE user_id = ${userId} AND token = ${token}
         `
    ).rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Falscher token.");
  }
}

export async function verifyUserEmail(user_id: string) {
  try {
    const res = await sql`
      UPDATE users 
      SET "emailVerified" = ${new Date().toISOString()} 
      WHERE id = ${user_id}`;
    return res.rowCount;
  } catch (error) {
    console.error(error);
    throw new Error("Die Email konnte nicht auf verifiziert gesetzt werden.");
  }
}

/* const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer", //from the tutorial i guess this is always shown wheen there is an eerror.
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }), //coerce means zwingene. Das was ich gerne mit Hannah oder mädchen tuen will :)
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
}); */

/* const CreateInvoice = FormSchema.omit({ id: true, date: true }); */

/* export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  //console.log(validatedFields);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoices",
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0]; //isolates only the date
  //console.log(date);

  try {
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Invoice",
    };
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    return { message: "Database Error: Failed to Update Invoice." };
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  throw new Error("Failed to Delete Invoice ");
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    return { message: "Database Error: Failed to Delete Invoice" };
  }
} */

/* export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
} */
