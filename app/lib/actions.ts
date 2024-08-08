"use server";

import { db, sql, VercelPoolClient } from "@vercel/postgres";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodIssue, z } from "zod";
import { RoadtripForm, RegisterForm, LoginForm } from "./definitions";
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

import { randomUUID } from "node:crypto";
import { sendVerificationEmail } from "app/utils/mail";
import { fetchRoadtripById } from "./data";

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

  const client = await db.connect();
  try {
    await client.sql`BEGIN`; // start a transaction
    const {
      rows: [{ id: user_id }],
    } = await client.sql`
        INSERT INTO users (name, email, password, birthday,sex)  
        VALUES (${username}, ${email}, ${password},${birthday.Date.toISOString()}, ${sex})
        RETURNING id`;

    const token = randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000).toISOString();
    await client.sql`
        INSERT INTO verification_token (identifier, expires, token, user_id)
        VALUES (uuid_generate_v4(), ${expires}, ${token}, ${user_id})
    `;
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
        path: [""],
      },
    ];

  const user_id = (await auth())?.user?.id;
  const client = await db.connect();
  try {
    await client.sql`BEGIN`; // start a transaction
    const {
      rows: [{ id: start_id }],
    } = await client.sql`
        INSERT INTO addresses (land, town)  
        VALUES (${start.land}, ${start.town})
        RETURNING id`;
    const {
      rows: [{ id: dest_id }],
    } = await client.sql`
        INSERT INTO addresses (land, town)  
        VALUES (${dest.land}, ${dest.town})
        RETURNING id`;
    var {
      rows: [{ id: imgName }],
    } = await client.sql`
        INSERT INTO roadtrips (user_id, start_id, dest_id, date, image_url, description)
        VALUES (${user_id},${start_id},${dest_id}, ${Date.toISOString()}, ${
      file.ext
    }, ${description})
        RETURNING id`;

    if (file) {
      const blob = await put(`${imgName}.${file.ext}`, file.File, {
        access: "public",
      });
      // console.log(blob);
      await client.sql`
        UPDATE roadtrips 
        SET image_url = ${blob.downloadUrl} 
        WHERE id = ${imgName};
      `;
    } else {
      await client.sql`ROLLBACK`; // rollback the transaction
    }
    await client.sql`COMMIT`; // commit the transaction
  } catch (error) {
    console.log(error);
    await client.sql`ROLLBACK`; // rollback the transaction
    return [
      {
        message: `Roadtrip konnte nicht eingetragen werden. ${error}`,
        path: ["submit"],
      },
    ];
  }
  revalidatePath("/insertRoadtrip");
  redirect("/routesOverview");
}

export async function editRoadtrip(
  prevState: error[],
  formData: FormData
): Promise<error[]> {
  //throw new Error("Failed to insert Roadtrip");
  const roadtripID = formData.get("roadtripId") as string;
  if (!roadtripID)
    return [
      {
        message: "das ist keine valide Roadtrip-id",
        path: ["submit"],
      },
    ];
  const roadtrip = (await fetchRoadtripById(roadtripID))[0];

  if (!roadtrip)
    return [
      {
        message: "das ist keine valide Roadtrip-id",
        path: ["submit"],
      },
    ];

  const user_id = (await auth())?.user?.id;
  if (Number(user_id) !== roadtrip.user_id) {
    return [
      {
        message: "Du kannst nur deine eigenen Roadtrips ändern!",
        path: ["submit"],
      },
    ];
  }
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
        path: [""],
      },
    ];

  const client = await db.connect();
  try {
    await client.sql`BEGIN`; // start a transaction
    await client.sql`
        UPDATE addresses 
          SET land = ${start.land}, town = ${start.town}
          WHERE id = ${roadtrip.start_id}
        `;
    await client.sql`
        UPDATE addresses 
          SET land = ${dest.land}, town = ${dest.town}
          WHERE id = ${roadtrip.dest_id}
        `;
    await client.sql`
        UPDATE roadtrips 
          SET (date, description) = (${Date.toISOString()}, ${description})
          WHERE id = ${roadtrip.id}
        `;

    if (file) {
      await del([roadtrip.image_url]);
      const blob = await put(`${roadtrip.id}.${file.ext}`, file.File, {
        access: "public",
      });
      const downloadURL = blob.downloadUrl;
      await client.sql`
        UPDATE roadtrips 
          SET image_url = ${downloadURL} 
          WHERE id = ${roadtrip.id};
      `;
    }

    await client.sql`COMMIT`; // commit the transaction
  } catch (error) {
    console.log(error);
    await client.sql`ROLLBACK`; // rollback the transaction
    return [
      {
        message: `Update vom Roadtrip fehlgeschlagen. ${error}`,
        path: ["submit"],
      },
    ];
  }
  revalidatePath("/insertRoadtrip");
  redirect("/dashboard");
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
export async function deleteVerificationTokenByUserId(userId: string) {
  try {
    await sql`
            DELETE FROM verification_token 
            WHERE user_id = ${userId}
         `;
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting token with userId: " + userId);
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
