// ich glaub im endeffekt schreibe ich hier das selber was eigentlich react hook form macht!
import {
  handleBlurType,
  handleChangeFileType,
  handleChangeType,
  handleClickType,
} from "lib/definitions";
import { arrIntersection, arrSubset } from "lib/utils/utils";
import { useEffect, useRef, useState } from "react";
import { error } from "lib/utils/validateInsertForm";
import { useFormState } from "react-dom";

export function useTouched(
  errorPaths: string[],
  action: (prevState: error[], formData: FormData) => Promise<error[]>,
  errorDict: { [key: string]: { [key: string]: string } }
) {
  const formRef = useRef(null);
  const [touched, setTouched_] = useState<string[]>([]);
  const initialState: error[] = [];
  const [state, dispatch] = useFormState(action, initialState);
  const [errors, setErrors] = useState<error[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const newErrors = state.filter(
      (error) => arrIntersection(touched, error.path).length
    );
    /* set translation of the servers */
    newErrors.map((error) => {
      error.path.forEach((path) => {
        if (
          errorDict.hasOwnProperty(path) &&
          errorDict[path].hasOwnProperty(error.message)
        )
          error.message = errorDict[path][error.message];
      });
    });
    setErrors(newErrors);
    setLoading(false);
  }, [state]);

  const Dispatch = (submit: boolean = false) => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    if (!submit) {
      dispatch(formData);
    } else {
      formData.append("submit", "true");
      dispatch(formData);
    }
  };

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

  const handleBlur: handleBlurType = async (event) => {
    const name = event.target.name;
    Dispatch();
    setTouched([...touched, name]);
  };

  const handleChangeFile: handleChangeFileType = async (event) => {
    const name = event.target.name;
    Dispatch();
    setTouched([...touched, name]);
  };

  const handleSubmit: handleClickType = async (e) => {
    setLoading(true);
    e.preventDefault();
    setTouched([...touched, ...errorPaths, "submit"]);
    Dispatch(true);
  };

  const handleChange: handleChangeType = async (event) => {
    const name = event.target.name;
    if (touched.includes(name)) {
      Dispatch();
    }
  };

  return {
    errors,
    formRef,
    handleBlur,
    handleChange,
    handleSubmit,
    handleChangeFile,
    dispatch,
    loading,
  };
}
