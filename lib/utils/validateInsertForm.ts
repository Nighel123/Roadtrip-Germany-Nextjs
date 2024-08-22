import {
  ErrorCodes,
  Lang,
  RoadtripEditForm,
  RoadtripForm,
  months,
} from "lib/definitions";
import { monthToNumber } from "./utils";
import { z } from "zod";
import { Client, GeocodeRequest } from "@googlemaps/google-maps-services-js";
import { zRoadtripID } from "./validateFormData";
import { getDictionary } from "../../app/[lang]/dictionaries";
export async function isAddressValid(a: string, b: string) {
  /* console.log(a, b); */
  return Promise.resolve(true);
}

async function validateAddress(town: string, land: string) {
  const client = new Client({});

  const result = await client.geocode({
    params: {
      key: "AIzaSyA-WcuB9Wr6_nOeFrOslc2K0-ZzXwky2d",
      address: `${town} ${land}`,
    },
  });
  if (result.data.results.length > 0) return true;
  return false;
}
function isEdit(
  o: RoadtripForm<any> | RoadtripEditForm<any>
): o is RoadtripEditForm<any> {
  return (o as RoadtripEditForm<any>).roadtripId !== undefined;
}
export function insertFormToZObj(o: RoadtripForm<any> | RoadtripEditForm<any>) {
  const {
    startland,
    starttown,
    destland,
    desttown,
    day,
    month,
    year,
    description,
    file,
  } = o;

  const dest = { land: destland, town: desttown };
  const start = { land: startland, town: starttown };
  const date = { day, month, year };
  const route = {
    start: start,
    dest: dest,
  };
  //console.log(file);
  let File;
  if (file.size === 0) {
    File = undefined;
  } else {
    File = file;
  }
  const formattedObj = {
    route: route,
    date: date,
    description,
    file,
  };
  if (isEdit(o)) {
    return {
      formattedObj: formattedObj,
      route: route,
      date: date,
      start: start,
      dest: dest,
      description: description,
      file: File,
      roadtripId: o.roadtripId,
    };
  }
  return {
    formattedObj: formattedObj,
    route: route,
    date: date,
    start: start,
    dest: dest,
    description: description,
    file: File,
  };
}

const zDate = z
  .object({
    day: z.coerce
      .number({ message: ErrorCodes.WRONG_DATA })
      .min(1, { message: ErrorCodes.TOO_LOW })
      .max(31, { message: ErrorCodes.TOO_HIGH }),
    month: z
      .enum(months, {
        message: ErrorCodes.WRONG_DATA,
      })
      .transform((month) => monthToNumber(month)),
    year: z.coerce
      .number({ message: ErrorCodes.WRONG_DATA })
      .min(new Date().getFullYear(), {
        message: ErrorCodes.TOO_LOW,
      })
      .max(new Date().getFullYear() + 5, {
        message: ErrorCodes.TOO_HIGH,
      }),
  })
  .transform(({ day, month, year }) => {
    const date = `${year}/${month}/${day}`;
    return { date, roadtripDate: new Date(`${year}/${month}/${day}`) };
  })
  .pipe(
    z.object({
      roadtripDate: z.date({ message: ErrorCodes.INVALID }).min(new Date(), {
        message: ErrorCodes.TOO_LOW,
      }),
      date: z.string(),
    })
  );

const zAddress = z
  .object({
    land: z
      .string({ message: ErrorCodes.WRONG_DATA })
      .min(2, {
        message: ErrorCodes.TOO_LOW,
      })
      .max(100, {
        message: ErrorCodes.TOO_HIGH,
      }),
    town: z
      .string({
        message: ErrorCodes.WRONG_DATA,
      })
      .min(2, {
        message: ErrorCodes.TOO_LOW,
      })
      .max(100, {
        message: ErrorCodes.TOO_HIGH,
      }),
  })
  .refine(
    async ({ land, town }) => {
      return await isAddressValid(town, land); /* todo: make it a real check. */
    },
    { message: ErrorCodes.INVALID }
  );

const zRoute = z
  .object({
    start: zAddress,
    dest: zAddress,
  })
  .refine(
    ({ dest, start }) =>
      !(dest.land === start.land && dest.town === start.town),
    {
      message: ErrorCodes.INVALID,
      path: ["dest"],
    }
  );

const zDescription = z
  .string({
    message: ErrorCodes.WRONG_DATA,
  })
  .min(100, {
    message: ErrorCodes.TOO_LOW,
  })
  .max(5000, {
    message: ErrorCodes.TOO_HIGH,
  });

const imageTypes = ["tiff", "jpg", "jpeg", "png"] as const;
const zFile = z
  .instanceof(File, {
    message: ErrorCodes.NO_DATA,
  })
  .transform((File) => {
    const { name, type, size } = File;
    const ext = type.split("/").pop(); // image/png -> png;
    return { name, ext, size, File };
  })
  .pipe(
    z.object({
      name: z.string({
        message: ErrorCodes.NO_DATA,
      }),
      ext: z.enum(imageTypes, {
        message: ErrorCodes.WRONG_DATA,
      }),
      size: z
        .number({
          message: ErrorCodes.WRONG_DATA,
        })
        .max(7000000, {
          message: ErrorCodes.TOO_HIGH,
        })
        .min(5000, {
          message: ErrorCodes.TOO_LOW,
        }),
      File: z.instanceof(File, {
        message: "Bitte lade ein Bild hoch.",
      }),
    })
  );

export const zFormDataObj = z.object({
  description: zDescription,
  date: zDate,
  route: zRoute,
  file: zFile,
});

export const zFormDataObjEdit = z.object({
  description: zDescription,
  date: zDate,
  route: zRoute,
  file: z.optional(zFile),
  roadtripId: zRoadtripID,
});

export type FormDataErrors = z.inferFlattenedErrors<
  typeof zFormDataObj,
  {
    path: (string | number)[];
    message: string;
  }
>;

export type error = { path: string[]; message: string };
export function formatErrors(e?: FormDataErrors): error[] {
  if (!e) return [];
  const errArr: error[] = [];
  const Errors = e.fieldErrors;
  for (const prop in Errors) {
    const path: string[] = [prop];
    const arr = Errors[prop as keyof typeof Errors];
    if (!arr) return [];
    for (const el of arr) {
      let Arr = el.path.map((p) => String(p));
      if (Arr.includes("start")) {
        Arr = Arr.filter((elem) => elem !== "route");
        if (Arr.includes("land")) {
          Arr.push("startland");
        }
        if (Arr.includes("town")) {
          Arr.push("starttown");
        }
      }
      if (Arr.includes("dest")) {
        Arr = Arr.filter((elem) => elem !== "route");
        if (Arr.includes("land")) {
          Arr.push("destland");
        }
        if (Arr.includes("town")) {
          Arr.push("desttown");
        }
      }

      errArr.push({ path: Arr, message: el.message });
    }
  }
  return errArr;
}
