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
import { editRoadtrip, insertRoadtrip } from "lib/actions";
import { useTouched } from "./useTouched";
import ErrorComponent from "./errorMessage";
import { RoadtripDisplay } from "lib/definitions";
import { Dict } from "../dictionaries";

const errorPaths = [
  "day",
  "month",
  "year",
  "date",
  "start",
  "dest",
  "file",
  "description",
  "roadtripId",
];

export default function InsertForm({
  roadtrip,
  dict,
}: {
  roadtrip: RoadtripDisplay | null;
  dict: Dict;
}) {
  const {
    errors,
    formRef,
    handleBlur,
    handleChangeFile,
    handleSubmit,
    loading,
  } = useTouched(errorPaths, roadtrip ? editRoadtrip : insertRoadtrip);

  /* make the error-componet sammmler */
  /* do checks whether the start and destaddress are the same */
  /* do checks whether those addresses exist.  */
  return (
    <form id="insertRoadtripForm" /* action={dispatch} */ ref={formRef}>
      <label htmlFor="startland">{dict.insertRoadtrip.startText}</label>
      <AddressInput
        name="start"
        handleBlur={handleBlur}
        roadtrip={roadtrip}
        dict={dict}
      />
      <ErrorComponent
        errors={errors}
        show={["start", "startland", "starttown"]}
      />

      <label htmlFor="destland">{dict.insertRoadtrip.destText}</label>
      <AddressInput
        name="dest"
        handleBlur={handleBlur}
        roadtrip={roadtrip}
        dict={dict}
      />
      <ErrorComponent
        errors={errors}
        show={["dest", "route", "desttown", "destland"]}
      />
      <label htmlFor="day">{dict.insertRoadtrip.dateText}</label>
      <DateInput handleBlur={handleBlur} roadtrip={roadtrip} dict={dict} />
      <ErrorComponent errors={errors} show={["date", "day", "month", "year"]} />
      <label htmlFor="description">{dict.insertRoadtrip.descriptionText}</label>
      <TextInput handleBlur={handleBlur} roadtrip={roadtrip} />
      <ErrorComponent errors={errors} show={["description"]} />

      <ImageUpload
        handleChangeFile={handleChangeFile}
        roadtrip={roadtrip}
        dict={dict}
      />
      <ErrorComponent errors={errors} show={["file", "submit", "roadtripId"]} />
      {roadtrip ? (
        <input hidden name="roadtripId" value={roadtrip.id} readOnly />
      ) : null}

      <Submit handleSubmit={handleSubmit} loading={loading} dict={dict} />
    </form>
  );
}
