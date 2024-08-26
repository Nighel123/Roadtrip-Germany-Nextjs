import { ErrorCodes, RegisterForm, months, sex } from "lib/definitions";
import { z } from "zod";
import bcrypt from "bcrypt";
import { monthToNumber } from "./utils";
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

const zBirthday = z.object({
  day: z.coerce
    .number({ message: ErrorCodes.WRONG_DATA })
    .min(1, { message: ErrorCodes.TOO_LOW })
    .max(32, { message: ErrorCodes.TOO_HIGH }),
  month: z
    .enum(months, {
      message: ErrorCodes.WRONG_DATA /* ${monthsLang.join(", ")} */,
    })
    .transform((month) => monthToNumber(month)),
  year: z.coerce
    .number({ message: ErrorCodes.WRONG_DATA })
    .min(new Date().getFullYear() - 201, {
      message: ErrorCodes.TOO_HIGH,
    })
    .max(new Date().getFullYear() - 12, {
      message: ErrorCodes.TOO_LOW,
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
          message: ErrorCodes.INVALID,
        }),
        date: z.string(),
      })
    );
};

export const zPassword = z
  .string({
    message: ErrorCodes.WRONG_DATA,
  })
  .min(8, {
    message: ErrorCodes.TOO_SHORT,
  })
  .max(100, {
    message: ErrorCodes.TOO_LONG,
  })
  .regex(
    //https://stackoverflow.com/questions/5142103/regex-to-validate-password-strength
    new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z])"),
    {
      message: ErrorCodes.WRONG_FORMAT,
    }
  )
  .transform(async (password) => {
    return await bcrypt.hash(password, 10);
  });

export const zRegisterForm = z.object({
  username: z
    .string({
      message: ErrorCodes.WRONG_CHARACTERS,
    })
    .min(2, {
      message: ErrorCodes.TOO_SHORT,
    })
    .max(60, {
      message: ErrorCodes.TOO_LONG,
    })
    .refine(
      async (username) => {
        return !(await checkIfUserNameExists(username));
      },
      {
        message: ErrorCodes.ALREADY_EXISTS,
      }
    ),
  email: z
    .string({ message: ErrorCodes.WRONG_CHARACTERS })
    .email({ message: ErrorCodes.WRONG_FORMAT })
    .refine(
      async (email) => {
        return !(await checkIfEmailExists(email));
      },
      { message: ErrorCodes.ALREADY_EXISTS }
    ),
  password: zPassword,
  birthday: refineDate(zBirthday),
  sex: z.enum(sex, {
    message: ErrorCodes.WRONG_DATA /* ${sexLang.join(`${register.or} `)}} */,
  }),
});
