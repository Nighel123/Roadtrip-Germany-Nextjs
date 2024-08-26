"use client";

import DateInput from "app/[lang]/insertRoadtrip/dateInput";
import ErrorComponent from "app/[lang]/insertRoadtrip/errorMessage";
import { useTouched } from "app/[lang]/insertRoadtrip/useTouched";
import { register } from "lib/actions";
import Submit from "./submit";
import { Dict } from "../dictionaries";
import PasswordInput from "./passwordInput";

const errorPaths = [
  "username",
  "email",
  "sex",
  "password",
  "day",
  "month",
  "year",
  "birthday",
];

export function Form({ dict }: { dict: Dict }) {
  const { errors, formRef, handleBlur, handleChange, handleSubmit, loading } =
    useTouched(errorPaths, register, dict.register.error);
  const sexLang = JSON.parse(dict.register.sexOptions);

  return (
    <form id="registerForm" /* action={dispatch} */ ref={formRef}>
      <div>
        <label htmlFor="username">{dict.register.username}</label>
        <div>
          <input
            type="text"
            id="username"
            name="username"
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </div>
        <ErrorComponent errors={errors} show={["username"]} />
      </div>

      <div>
        <label htmlFor="email">{dict.register.email}</label>
        <div>
          <input
            type="email"
            id="email"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </div>
        <ErrorComponent errors={errors} show={["email"]} />
      </div>

      <div>
        <label htmlFor="password">{dict.register.password}</label>
        <div className="password">
          <PasswordInput handleBlur={handleBlur} handleChange={handleChange} />
        </div>
        <ErrorComponent errors={errors} show={["password"]} />
      </div>

      <div>
        <label htmlFor="day">{dict.register.birthday}</label>
        <DateInput handleBlur={handleBlur} roadtrip={null} dict={dict} />
        <ErrorComponent
          errors={errors}
          show={["birthday", "day", "month", "year"]}
        />
      </div>
      <div className="sex">
        <label htmlFor="sex">{dict.register.sex}</label>
        <div>
          <select
            id="sex"
            name="sex"
            /* defaultValue="weiblich" */
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option defaultValue="weiblich">{dict.register.sex}</option>
            <option value="weiblich">{sexLang[0]}</option>
            <option value="männlich">{sexLang[1]}</option>
          </select>
        </div>
        <ErrorComponent errors={errors} show={["sex", "submit"]} />
      </div>

      <Submit handleSubmit={handleSubmit} loading={loading} dict={dict} />
    </form>
  );
}
