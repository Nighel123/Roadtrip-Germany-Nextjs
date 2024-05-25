import { RegisterForm, months, sex } from "app/lib/definitions";
import { z } from "zod";
import bcrypt from "bcrypt";
import { monthToNumber } from "app/lib/utils";
import { sql } from "@vercel/postgres";

async function checkUserNameExists(a: string) {
  return Promise.resolve(false);
}

async function checkIfUserNameExists(a: string) {
  const res = await sql`SELECT name FROM users WHERE name=${a}`;
  return Boolean(res.rows.length);
}
async function checkEmailExists(a: string) {
  return Promise.resolve(false);
}
async function checkIfEmailExists(a: string) {
  const res = await sql`SELECT email FROM users WHERE email=${a}`;
  return Boolean(res.rows.length);
}

export function formatRegisterData(o: RegisterForm<any>) {
  const { day, month, year, ...u } = o;
  const w = { ...u, birthday: { day, month, year } };
  return w;
}

export const zBirthday = z.object({
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
    .min(new Date().getFullYear() - 201, {
      message:
        "Guten gewissens haben wir das Maximalalter von Roadtriplern auf 201 Jahre geesetzt.",
    })
    .max(new Date().getFullYear() - 12, {
      message:
        "Du solltest mindestens 12 Jahre alt sein um einen Roadtrip reinstellen zu können.",
    }),
});

const refineDate = (o: z.ZodTypeAny) => {
  return o
    .transform(({ day, month, year }) => {
      const date = `${year}/${month}/${day}`;
      return { date, Date: new Date(`${year}/${month}/${day}`) };
    })
    .pipe(
      z.object({
        Date: z.date({ message: "Wir konnten das Datum nicht verifizieren." }),
        date: z.string(),
      })
    );
};

export const zRegisterForm = z.object({
  username: z
    .string({ message: "Bitte gebe eine Buchstabenreihe den Nutzernamen ein." })
    .min(2, {
      message: "Bitte gebe mindestes zwei Buchstaben für den Nutzernamen ein.",
    })
    .max(60, {
      message: "Bitte gebe maximal 60 Buchstaben für den Nutzernamen ein.",
    })
    .refine(
      async (username) => {
        return !(await checkIfUserNameExists(username));
      },
      {
        message: "Dieser Nutzerame existiert bereits.",
      }
    ),
  email: z
    .string({ message: "Bitte gebe eine Buchstabenreihe als Email ein." })
    .email({ message: "Das ist keine valide Email-Addresse." })
    .refine(
      async (email) => {
        return !(await checkIfEmailExists(email));
      },
      { message: "Diese Email existiert bereits." }
    ),
  password: z
    .string({
      message:
        'Bitte gebe eine Zeichenreiche in Form eines "Strings" als Passwort ein.',
    })
    .min(8, {
      message: "Bitte gebe mindestens acht Zeichen als Passwort ein.",
    })
    .max(100, {
      message: "Bitte gebe maximal 100 Zeichen als Passwort ein.",
    })
    .regex(
      //https://stackoverflow.com/questions/5142103/regex-to-validate-password-strength
      new RegExp("^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])"),
      {
        message:
          "Das Passwort sollte mindestens jeweils einen großen, einen kleinen, eine Zahl und ein Sonderzeichen enthalten.",
      }
    )
    .transform(async (password) => {
      return await bcrypt.hash(password, 10);
    }),
  birthday: refineDate(zBirthday),
  sex: z.enum(sex, {
    message:
      "Für dein Geschelcht wähle bitte entweder weiblich oder männlich aus.",
  }),
});
