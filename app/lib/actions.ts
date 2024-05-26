"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodIssue } from "zod";
import { RoadtripForm, RegisterForm } from "./definitions";
import fs from "fs";
import {
  FormDataErrors,
  formatErrors,
  insertFormToZObj,
  zFormDataObj,
  error,
} from "app/insertRoadtrip/utils";
import { formatRegisterData, zRegisterForm } from "app/register/utils";
import { signIn } from "auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";

const { log } = console;

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      //log(error);
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
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

export async function register(
  prevState: error[],
  formData: FormData
): Promise<error[]> {
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

  const { username, email, password, birthday, sex } = resFormDataObj.data;

  try {
    await sql`
        INSERT INTO users (name, email, password, birthday,sex)  
        VALUES (${username}, ${email}, ${password},${birthday.date}, ${sex})`;
  } catch (error) {
    console.log(error);
    return [
      {
        message: "Database Fehler: Benutzer konnte nicht erstellt werden.",
        path: ["database"],
      },
    ];
  }

  redirect("/");
}
export async function insertRoadtrip(
  prevState: error[],
  formData: FormData
): Promise<error[]> {
  //throw new Error("Failed to insert Roadtrip");
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

  const user_id = "410544b2-4001-4271-9855-fec4b6a6442a";

  try {
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
        VALUES (${user_id},${start_id},${dest_id}, ${date}, ${file.ext}, ${description})
        RETURNING id`;
  } catch (error) {
    console.log(error);
    return [
      {
        message: "Database Fehler: Roadtrip konnte nicht eingetragen werden.",
        path: ["database"],
      },
    ];
  }

  if (file) {
    const arrayBuffer = await file.File.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    await fs.writeFile(
      `./public/uploads/${file.name + file.ext}`,
      buffer,
      (err) => {
        console.log(err);
        return [
          {
            message: "Failure writing file.",
            path: ["file"],
          },
        ];
      }
    );
  }

  revalidatePath("/insertRoadtrip");
  redirect("/routesOverview");
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

export async function createInvoice(prevState: State, formData: FormData) {
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
}

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
