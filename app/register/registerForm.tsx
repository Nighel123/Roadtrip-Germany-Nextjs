"use client";

import DateInput from "app/insertRoadtrip/dateInput";
import ErrorComponent from "app/insertRoadtrip/errorMessage";
import { useTouched } from "app/insertRoadtrip/useTouched";
import { error } from "app/insertRoadtrip/utils";
import { register } from "app/lib/actions";

import { useFormState } from "react-dom";

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

export function Form() {
  const initialState: error[] = [];
  const [state, dispatch] = useFormState(register, initialState);
  const { touched, formRef, handleBlur, handleChange, handleSubmit } =
    useTouched(dispatch, errorPaths);

  return (
    <form id="registerForm" action={dispatch} ref={formRef}>
      <div>
        <label htmlFor="username">Nutzername</label>
        <div>
          <input
            type="text"
            id="username"
            name="username"
            onBlur={handleBlur}
            onChange={handleChange}
            defaultValue={"Nighel123"}
          />
        </div>
        <ErrorComponent errors={state} touched={touched} show={["username"]} />
      </div>

      <div>
        <label htmlFor="email">E-Mail-Adresse</label>
        <div>
          <input
            type="email"
            id="email"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            defaultValue={"Nighel123@gmail.com"}
          />
        </div>
        <ErrorComponent errors={state} touched={touched} show={["email"]} />
      </div>

      <div>
        <label htmlFor="password">Passwort</label>
        <div className="password">
          <input
            type="password"
            id="password"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            defaultValue={"Nighel123@gmail.com"}
          />
        </div>
        <ErrorComponent errors={state} touched={touched} show={["password"]} />
      </div>

      <div>
        <label htmlFor="day">Geburtstag</label>
        <DateInput handleBlur={handleBlur} />
        <ErrorComponent
          errors={state}
          touched={touched}
          show={["birthday", "day", "month", "year"]}
        />
      </div>
      <div className="sex">
        <label htmlFor="sex">Geschlecht</label>
        <div>
          <select
            id="sex"
            name="sex"
            defaultValue="weiblich"
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option defaultValue="weiblich">Geschlecht</option>
            <option value="weiblich">Weiblich</option>
            <option value="männlich">Männlich</option>
          </select>
        </div>
        <ErrorComponent errors={state} touched={touched} show={["sex"]} />
      </div>

      <input
        type="image"
        id="registrieren"
        onClick={handleSubmit}
        src="/register/registrieren.jpg"
      />
    </form>
  );
}
