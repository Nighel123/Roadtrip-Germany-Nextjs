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
import { useTouched } from "./useTouched";
import ErrorComponent from "./errorMessage";

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
  const {
    errors,
    formRef,
    handleBlur,
    handleChangeFile,
    handleSubmit,
    dispatch,
    loading,
  } = useTouched(errorPaths, insertRoadtrip);

  /* make the error-componet sammmler */
  /* do checks whether the start and destaddress are the same */
  /* do checks whether those addresses exist.  */
  return (
    <form id="insertRoadtripForm" /* action={dispatch} */ ref={formRef}>
      <label htmlFor="startland">Wo wollt ihr losfahren?</label>
      <AddressInput name="start" handleBlur={handleBlur} />
      <ErrorComponent
        errors={errors}
        show={["start", "startland", "starttown"]}
      />

      <label htmlFor="destland">Wo wollt ihr hin?</label>
      <AddressInput name="dest" handleBlur={handleBlur} />
      <ErrorComponent
        errors={errors}
        show={["dest", "route", "desttown", "destland"]}
      />
      <label htmlFor="day">Wann wollt ihr losfahren?</label>
      <DateInput handleBlur={handleBlur} />
      <ErrorComponent errors={errors} show={["date", "day", "month", "year"]} />
      <label htmlFor="description">
        Beschreibe in einem Text wer du bist und was du auf deiner Reise
        vorhast:
      </label>
      <TextInput handleBlur={handleBlur} />
      <ErrorComponent errors={errors} show={["description"]} />

      <ImageUpload handleChangeFile={handleChangeFile} />
      <ErrorComponent errors={errors} show={["file", "submit"]} />

      <Submit handleSubmit={handleSubmit} loading={loading} />
    </form>
  );
}
