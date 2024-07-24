import { RoadtripForm, months } from "app/lib/definitions";
import { monthToNumber } from "app/lib/utils";
import { z } from "zod";
import { Client, GeocodeRequest } from "@googlemaps/google-maps-services-js";
export async function isAddressValid(a: string, b: string) {
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

export function insertFormToZObj(o: RoadtripForm<any>) {
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
    submit = false,
  } = o;
  const dest = { land: destland, town: desttown };
  const start = { land: startland, town: starttown };
  const date = { day, month, year };
  const route = {
    start: start,
    dest: dest,
  };
  const formattedObj = {
    route: route,
    date: date,
    description,
    file,
  };
  return {
    formattedObj: formattedObj,
    route: route,
    date: date,
    start: start,
    dest: dest,
    description: description,
    file: file,
  };
}

export const zDate = z
  .object({
    day: z.coerce
      .number({ message: "Bitte gebe eine Nummer für den Tag ein." })
      .min(1, { message: "Bitte gebe einen Tag gößer eins ein." })
      .max(32, { message: "Bitte gebe einen Tag der kleiner als 32 ist ein." }),
    month: z
      .enum(months, {
        message: `Bitte wähle einen der folgneden Monate aus: ${months.join(
          ", "
        )}`,
      })
      .transform((month) => monthToNumber(month)),
    year: z.coerce
      .number({ message: "Bitte gebe eine Nummer für das Jahr ein." })
      .min(new Date().getFullYear(), {
        message:
          "Bitte wähle ein Jahr, dass in der größer als " +
          new Date().getFullYear(),
      })
      .max(new Date().getFullYear() + 5, {
        message:
          "Bitte wähle ein Jahr, dass wenigeer als fünf Jahre in der Zukunft liegt aus, also vor " +
          new Date().getFullYear() +
          1,
      }),
  })
  .transform(({ day, month, year }) => {
    const date = `${year}/${month}/${day}`;
    return { date, Date: new Date(`${year}/${month}/${day}`) };
  })
  .pipe(
    z.object({
      Date: z
        .date({ message: "Wir konnten das Datum nicht verifizieren." })
        .min(new Date(), {
          message: "Bitte wähle ein Datum aus, dass in der Zukunft liegt.",
        }),
      date: z.string(),
    })
  );

const zAddress = z
  .object({
    land: z
      .string({ message: "Bitte gebe eine Buchstabenreihe für ein Land ein." })
      .min(2, {
        message: "Bitte gebe mindestens zwei Buchstaben für ein Land ein.",
      })
      .max(100, {
        message: "Bitte gebe maximal 100 Buchstaben für ein Land ein.",
      }),
    town: z
      .string({
        message: "Bitte gebe eine Buchstabenreihe für eine Stadt ein.",
      })
      .min(2, {
        message: "Bitte gebe mindestens zwei Buchstaben für eine Stadt ein.",
      })
      .max(100, {
        message: "Bitte gebe maximal 100 Buchstaben für eine Stadt ein.",
      }),
  })
  .refine(
    async ({ land, town }) => {
      return await isAddressValid(town, land); /* todo: make it a real check. */
    },
    { message: "Bitte gebe eine gültige Addresse ein." }
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
      message: "Start- und Zieladdresse dürfen nicht gleich sein.",
      path: ["dest"],
    }
  );

const zDescription = z
  .string({
    message: "Bitte gebe nur Buchstaben für die Beschreibung ein.",
  })
  .min(100, {
    message:
      "Bitte schreibe einen Beschreibungstext der mindestens 100 Buchstaben lang ist.",
  })
  .max(5000, {
    message: "Bitte gebe maximal 5000 Buchstaben für die Beschreibung ein.",
  });

const imageTypes = ["tiff", "jpg", "jpeg", "png"] as const;
const zFile = z
  .instanceof(File, {
    message: "Bitte lade ein Bild hoch.",
  })
  .transform((File) => {
    const { name, type, size } = File;
    const ext = type.split("/").pop(); // image/png -> png;
    return { name, ext, size, File };
  })
  .pipe(
    z.object({
      name: z.string({
        message: "Bitte lade ein Bild hoch.",
      }),
      ext: z.enum(imageTypes, {
        message: `Bitte lade ein Bild von folgendem Typ hoch: ${imageTypes.join(
          ", "
        )}`,
      }),
      size: z
        .number({
          message: "Bitte lade ein Bild mit einer gültigen größe hoch.",
        })
        .max(1000000, {
          message:
            "Bitte lade ein Bild mit einer maximalen größe von 1Mb hoch.",
        })
        .min(5000, {
          message:
            "Bitte lade ein Bild mit einer minimalen größe von 5Kb hoch.",
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
