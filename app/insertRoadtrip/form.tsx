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
import Err from "./errorMessage";
import { FocusEvent, useRef, useState } from "react";

export type handleBlurType = (
  e: FocusEvent<HTMLInputElement | HTMLSelectElement>
) => void;

export default function insertForm() {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(insertRoadtrip, initialState);
  const [touched, setTouched] = useState<string[]>([]);
  const formRef = useRef(null);

  const handleBlur: handleBlurType = (e) => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const name = e.target.name;

    if (touched.includes(name)) {
      formData.set("touched", JSON.stringify(touched));
    } else {
      const nextTouched = [...touched];
      nextTouched.push(name);
      setTouched(nextTouched);
      formData.set("touched", JSON.stringify(nextTouched));
    }
    dispatch(formData);
  };

  return (
    <form id="insertRoadtripForm" action={dispatch} ref={formRef}>
      <p>Wo wollt ihr losfahren?</p>
      <AddressInput name="start" />
      <Err errors={state.errors?.startland} />
      <Err errors={state.errors?.starttown} />

      <p>Wo wollt ihr hin?</p>
      <AddressInput name="dest" />
      <Err errors={state.errors?.destland} />
      <Err errors={state.errors?.desttown} />
      <p>Wann wollt ihr losfahren?</p>
      <DateInput handleBlur={handleBlur} />
      <Err errors={state.errors?.day} />
      <Err errors={state.errors?.month} />
      <Err errors={state.errors?.year} />
      <p>
        Beschreibe in einem Text wer du bist und was du auf deiner Reise
        vorhast:
      </p>
      <TextInput />
      <Err errors={state.errors?.description} />

      <ImageUpload />

      <Submit />
    </form>
  );
}
