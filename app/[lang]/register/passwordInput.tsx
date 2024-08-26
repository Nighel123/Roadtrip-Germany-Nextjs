"use client";
import { EyeIcon } from "@heroicons/react/24/outline";
import { handleBlurType, handleChangeType } from "lib/definitions";
import { useState } from "react";

export default function PasswordInput({
  handleBlur,
  handleChange,
}: {
  handleChange: handleChangeType;
  handleBlur: handleBlurType;
}) {
  const [type, setType] = useState<"password" | "text">("password");
  const showHidePw = () => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };
  return (
    <>
      <input
        type={type}
        id="password"
        name="password"
        onBlur={handleBlur}
        onChange={handleChange}
      />
      <span onClick={showHidePw}>
        <EyeIcon />
      </span>
    </>
  );
}
