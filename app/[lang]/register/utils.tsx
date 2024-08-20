import { RegisterForm, months, sex } from "lib/definitions";
import { z } from "zod";
import bcrypt from "bcrypt";
import { monthToNumber } from "lib/utils";
import { sql } from "@vercel/postgres";
import { getDictionary } from "../dictionaries";

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

export async function validateRegisterForm(
  formatedDataObj: ReturnType<typeof formatRegisterData>,
  lang: "en" | "de"
) {
  const dict = await getDictionary(lang);
  const monthsLang = JSON.parse(dict.register.monthsLang);
  const sexLang = JSON.parse(dict.register.sexOptions);
  const { register } = dict;
  const { error } = register;

  const zBirthday = z.object({
    day: z.coerce
      .number({ message: error.day.WRONG_DATA })
      .min(1, { message: error.day.TOO_LOW })
      .max(32, { message: error.day.TOO_HIGH }),
    month: z
      .enum(months, {
        message: `${error.month.WRONG_DATA} ${monthsLang.join(", ")}`,
      })
      .transform((month) => monthToNumber(month)),
    year: z.coerce
      .number({ message: error.year.WRONG_DATA })
      .min(new Date().getFullYear() - 201, {
        message: error.year.TOO_HIGH,
      })
      .max(new Date().getFullYear() - 12, {
        message: error.year.TOO_LOW,
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
          Date: z.date({
            message: error.date.INVALID,
          }),
          date: z.string(),
        })
      );
  };

  const zRegisterForm = z.object({
    username: z
      .string({
        message: error.username.WRONG_CHARACTERS,
      })
      .min(2, {
        message: error.username.TOO_SHORT,
      })
      .max(60, {
        message: error.username.TOO_LONG,
      })
      .refine(
        async (username) => {
          return !(await checkIfUserNameExists(username));
        },
        {
          message: error.username.ALREADY_EXISTS,
        }
      ),
    email: z
      .string({ message: error.email.WRONG_CHARACTERS })
      .email({ message: error.email.WRONG_FORMAT })
      .refine(
        async (email) => {
          return !(await checkIfEmailExists(email));
        },
        { message: error.email.ALREADY_EXISTS }
      ),
    password: z
      .string({
        message: error.password.WRONG_DATA,
      })
      .min(8, {
        message: error.password.TOO_SHORT,
      })
      .max(100, {
        message: error.password.TOO_LONG,
      })
      .regex(
        //https://stackoverflow.com/questions/5142103/regex-to-validate-password-strength
        new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z])"),
        {
          message: error.password.WRONG_FORMAT,
        }
      )
      .transform(async (password) => {
        return await bcrypt.hash(password, 10);
      }),
    birthday: refineDate(zBirthday),
    sex: z.enum(sex, {
      message: `${error.sex.WRONG_DATA} ${sexLang.join(`${register.or} `)}} ${
        error.sex.WRONG_DATA_END
      }`,
    }),
  });

  return await zRegisterForm.safeParseAsync(formatedDataObj);
}
