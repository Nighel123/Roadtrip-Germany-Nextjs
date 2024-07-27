// ich glaub im endeffekt schreibe ich hier das selber was eigentlich react hook form macht!
import {
  handleBlurType,
  handleChangeFileType,
  handleChangeType,
  handleClickType,
} from "app/lib/definitions";
import { arrSubset } from "app/lib/utils";
import { useRef, useState } from "react";
import { useCallback } from "react";
import { error } from "./utils";
import { useFormState } from "react-dom";

export function useTouched(
  errorPaths: string[],
  action: (prevState: error[], formData: FormData) => Promise<error[]>
) {
  const formRef = useRef(null);

  const [touched, setTouched_] = useState<string[]>([]);
  const initialState: error[] = [];
  const [state, dispatch] = useFormState(action, initialState);

  const delayedSetToched = useCallback(
    (newTouched: string[]) => {
      setTimeout(() => setTouched(newTouched), 700);
    },
    [state]
  );

  const setTouched = (newTouched_: string[]) => {
    //make the entries unique inside newTouched
    const newTouched = [...new Set(newTouched_)];
    //do nothing if the values are already inside touched
    if (arrSubset(newTouched, touched)) {
      return;
    }
    if (arrSubset(["day", "month", "year"], newTouched)) {
      setTouched_([...newTouched, "date"]);
      return;
    }
    if (arrSubset(["desttown", "destland"], newTouched)) {
      setTouched_([...newTouched, "dest"]);
      return;
    }
    if (arrSubset(["starttown", "startland"], newTouched)) {
      setTouched_([...newTouched, "start"]);
      return;
    }
    if (
      arrSubset(
        ["starttown", "startland", "starttown", "startland"],
        [...newTouched]
      )
    ) {
      setTouched_([...newTouched, "route"]);
      return;
    }
    setTouched_([...newTouched]);
  };

  const Dispatch = async (submit?: boolean) => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    if (!submit) {
      dispatch(formData);
    } else {
      formData.append("submit", "true");
      dispatch(formData);
    }
  };
  const handleBlur: handleBlurType = async (event) => {
    const name = event.target.name;
    Dispatch();
    delayedSetToched([...touched, name]);
  };

  const handleChangeFile: handleChangeFileType = async (event) => {
    const name = event.target.name;
    Dispatch();
    delayedSetToched([...touched, name]);
  };

  const handleSubmit: handleClickType = async () => {
    Dispatch(true);
    delayedSetToched(errorPaths);
  };

  const handleChange: handleChangeType = async (event) => {
    const name = event.target.name;
    if (touched.includes(name)) {
      Dispatch();
    }
  };

  return {
    touched,
    setTouched,
    formRef,
    handleBlur,
    handleChange,
    handleSubmit,
    handleChangeFile,
    dispatch,
    state,
  };
}
