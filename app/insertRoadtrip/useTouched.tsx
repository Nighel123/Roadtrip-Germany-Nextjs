// ich glaub im endeffekt schreibe ich hier das selber was eigentlich react hook form macht!
import {
  handleBlurType,
  handleChangeFileType,
  handleChangeType,
  handleClickType,
} from "app/lib/definitions";
import { arrSubset } from "app/lib/utils";
import { useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function useTouched(
  dispatch: (payload: FormData) => void,
  errorPaths: string[]
) {
  const [touched, setTouched_] = useState<string[]>([]);
  const formRef = useRef(null);

  const setTouched = (newTouched_: string[]) => {
    //make the entries unique inside newTouched
    const newTouched = new Set(newTouched_);
    //do nothing if the values are already inside touched
    if (new Set(newTouched, touched)) {
      return;
    }
    if (new Set(["day", "month", "year"]).isSubsetOf(newTouched)) {
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

  const Dispatch = () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    dispatch(formData);
  };
  const handleBlur: handleBlurType = useDebouncedCallback((event) => {
    const name = event.target.name;
    setTouched([...touched, name]);
    Dispatch();
  }, 500);

  const handleChangeFile: handleChangeFileType = (event) => {
    const name = event.target.name;
    setTouched([...touched, name]);
    Dispatch();
  };

  const handleSubmit: handleClickType = (event) => {
    setTouched(errorPaths);
  };

  const handleChange: handleChangeType = useDebouncedCallback((event) => {
    const name = event.target.name;
    if (touched.includes(name)) {
      Dispatch();
    }
  }, 500);

  return {
    touched,
    setTouched,
    formRef,
    handleBlur,
    handleChange,
    handleSubmit,
    handleChangeFile,
  };
}
