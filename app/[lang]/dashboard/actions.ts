"use server";

import { db, sql } from "@vercel/postgres";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodIssue, z } from "zod";
import {
  DeleteRoadtripForm,
  RoadtripEditForm,
  ErrorCodes,
} from "lib/definitions";
import {
  FormDataErrors,
  formatErrors,
  insertFormToZObj,
  error,
  zFormDataObjEdit,
} from "lib/utils/validateInsertForm";
import { auth, signOut } from "auth";

import { fetchRoadtripById } from "lib/data/data";
import { zDeleteRoadtrip } from "lib/utils/validateFormData";

export async function deleteRoadtrip(
  prevState: string | undefined,
  formData: FormData
) {
  const DeleteObj = Object.fromEntries(
    formData.entries()
  ) as DeleteRoadtripForm<any>;

  const parsedForm = zDeleteRoadtrip.safeParse(DeleteObj);

  if (!parsedForm.success) {
    return ErrorCodes.SERVER_ERROR;
  }

  const { id } = parsedForm.data;
  const roadtrip = (await fetchRoadtripById(id))[0];
  if (!roadtrip) return ErrorCodes.SERVER_ERROR;

  try {
    await del([roadtrip.image_url]);
    await sql`DELETE FROM roadtrips
                WHERE id = ${id}
              `;
  } catch (error) {
    console.log(error);
    return ErrorCodes.SERVER_ERROR;
  }
  revalidatePath("/dashboard");
}

export async function deleteUser(
  prevState: string | undefined,
  formData: FormData
) {
  const userId = (await auth())?.user?.id;
  try {
    const { rows } = await sql<{
      image_url: string;
    }>`SELECT image_url FROM roadtrips WHERE user_id = ${userId}`;
    if (rows.length !== 0) {
      const flat = rows.flatMap((obj) => obj.image_url);
      await del(flat);
    }
    await sql`DELETE FROM messages WHERE "from" = ${userId} OR "to" = ${userId}`;
    await sql`DELETE FROM users
                WHERE id = ${userId}
              `;
  } catch (error) {
    console.log(error);
    return ErrorCodes.SERVER_ERROR;
  }
  await signOut();
  revalidatePath("/dashboard");
}

export async function editRoadtrip(
  prevState: error[],
  formData: FormData
): Promise<error[]> {
  //throw new Error("Failed to insert Roadtrip");
  const submit = formData.get("submit");
  const formDataObj = Object.fromEntries(
    formData.entries()
  ) as RoadtripEditForm<any>;
  const formDataZObj = insertFormToZObj(formDataObj);
  const resFormDataObj = await zFormDataObjEdit.safeParseAsync(formDataZObj);
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
    date: { date },
    roadtripId,
  } = resFormDataObj.data;
  const roadtrip = (await fetchRoadtripById(roadtripId))[0];

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

  // we have a mocked async AddressCheck function inside our validation.

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
          SET (date, description) = (${date}, ${description})
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
