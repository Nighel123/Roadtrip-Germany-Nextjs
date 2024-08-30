"use server";

import { db } from "@vercel/postgres";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodIssue } from "zod";

import {
  FormDataErrors,
  formatErrors,
  insertFormToZObj,
  zFormDataObj,
  error,
} from "lib/utils/validateInsertForm";

import { auth } from "auth";
import { RoadtripForm } from "lib/definitions";

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
    date: { date },
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
        VALUES (${user_id},${start_id},${dest_id}, ${date}, ${file.ext}, ${description})
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
