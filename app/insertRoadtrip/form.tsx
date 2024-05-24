"use client";

/* css */
import "@/styles/insertRoadtrip.css";
import "@/styles/insertRoadtripForm.css";

/* components */
import AddressInput from "./addressInput";
import DateInput from "./dateInput";
import TextInput from "./textInput";
import ImageUpload from "./imageUpload";
import Submit from "./submit";
import { insertRoadtrip } from "app/lib/actions";
import { useFormState } from "react-dom";
import {
  ChangeEvent,
  FocusEvent,
  MouseEvent,
  MutableRefObject,
  useRef,
  useState,
} from "react";
import { error } from "./utils";
import { useTouched } from "./useTouched";
import ErrorComponent from "./errorMessage";
import {
  Dispatch,
  handleBlurType,
  handleChangeFileType,
  handleClickType,
} from "app/lib/definitions";
import { factoryHandleBlur } from "app/lib/utils";

const { log } = console;
const errorPaths = [
  "day",
  "month",
  "year",
  "date",
  "start",
  "dest",
  "file",
  "description",
];

export default function insertForm() {
  const initialState: error[] = [];
  const [state, dispatch] = useFormState(insertRoadtrip, initialState);
  const { touched, formRef, handleBlur, handleChangeFile, handleSubmit } =
    useTouched(dispatch, errorPaths);

  /* make the error-componet sammmler */
  /* do checks whether the start and destaddress are the same */
  /* do checks whether those addresses exist.  */
  return (
    <form id="insertRoadtripForm" action={dispatch} ref={formRef}>
      <label htmlFor="startland">Wo wollt ihr losfahren?</label>
      <AddressInput name="start" handleBlur={handleBlur} />
      <ErrorComponent
        errors={state}
        touched={touched}
        show={["start", "startland", "starttown"]}
      />

      <label htmlFor="destland">Wo wollt ihr hin?</label>
      <AddressInput name="dest" handleBlur={handleBlur} />
      <ErrorComponent
        errors={state}
        touched={touched}
        show={["dest", "route", "desttown", "destland"]}
      />
      <label htmlFor="day">Wann wollt ihr losfahren?</label>
      <DateInput handleBlur={handleBlur} />
      <ErrorComponent
        errors={state}
        touched={touched}
        show={["date", "day", "month", "year"]}
      />
      <label htmlFor="description">
        Beschreibe in einem Text wer du bist und was du auf deiner Reise
        vorhast:
      </label>
      <TextInput handleBlur={handleBlur} />
      <ErrorComponent errors={state} touched={touched} show={["description"]} />

      <ImageUpload handleChangeFile={handleChangeFile} />
      <ErrorComponent errors={state} touched={touched} show={["file"]} />

      <Submit handleSubmit={handleSubmit} />
    </form>
  );
}
