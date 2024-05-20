"use server";

import { sql } from "@vercel/postgres";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { RoadtripDisplay, RoadtripForm, months, Month } from "./definitions";
import { deleteEmptyKeys, restrict } from "./utils";

const monthToNumber = (month: Month) => months.indexOf(month) + 1;

const zobj = {
  startland: z.string(),
  starttown: z.string(),
  destland: z.string(),
  desttown: z.string(),
  day: z.coerce
    .number({
      required_error: "bitte gebe einen Tag ein.",
      invalid_type_error: "bitte gebe eine Zahl für den Tag ein.",
    })
    .gt(0, { message: "Bitte gebe einen Tag größer als 0 ein." })
    .lt(32, { message: "Bitte gebe einen Tag kleiner als 32 ein." }),
  year: z.coerce.number({
    required_error: "bitte gebe einen Jahr ein.",
    invalid_type_error: "bitte gebe eine Zahl für ein Jahr ein.",
  }),
  month: z.enum(months, {
    message: "Bitte wähle einen Monat aus.",
  }),
  description: z
    .string()
    .length(100, { message: "Bitte gebe mindestens 100 Zeichen ein." }),
};

export type State = {
  errors?: {
    startland?: string[];
    starttown?: string[];
    destland?: string[];
    desttown?: string[];
    day?: string[];
    year?: string[];
    month?: string[];
    description?: string[];
  };
  message?: string | null;
};

export async function insertRoadtrip(prevState: State, formData: FormData) {
  //throw new Error("Failed to insert Roadtrip");

  const formDataObj = Object.fromEntries(formData.entries()) as RoadtripForm & {
    touched: string;
  };
  const touched = JSON.parse(formDataObj.touched) as string[];

  const restrictedFormDataObj = restrict(touched, formDataObj);
  const trimmedRestrictedFormDataObj = deleteEmptyKeys(restrictedFormDataObj);
  const restrictedzobj = restrict(touched, zobj);
  const FormSchema = z.object(restrictedzobj);

  const validatedFields = FormSchema.safeParse(trimmedRestrictedFormDataObj);

  if (!validatedFields.success) {
    console.log(validatedFields);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  const {
    startland,
    starttown,
    destland,
    desttown,
    day,
    month: monthInLetters,
    year,
    description,
  } = validatedFields.data;

  // Test it out:
  const month = monthToNumber(monthInLetters);
  const date = `${year}/${month}/${day}`;
  const user_id = "410544b2-4001-4271-9855-fec4b6a6442a";
  const image_url = ".jpg";
  try {
    const {
      rows: [{ id: start_id }],
    } = await sql`
        INSERT INTO addresses (land, town)  
        VALUES (${startland}, ${starttown})
        RETURNING id`;
    const {
      rows: [{ id: dest_id }],
    } = await sql`
        INSERT INTO addresses (land, town)  
        VALUES (${destland}, ${desttown})
        RETURNING id`;
    await sql`
        INSERT INTO roadtrips (user_id, start_id, dest_id, date, image_url, description)
        VALUES (${user_id},${start_id},${dest_id}, ${date}, ${image_url}, ${description})
        RETURNING id`;
  } catch (error) {
    console.log(error);
    return {
      message: "Database Error: Failed to Create Invoice",
    };
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
