import { useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";

export function useShowPw() {
  const [type, setType] = useState<"password" | "text">("password");
  const showHidePw = () => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

  const clickElement = (
    <span onClick={showHidePw}>
      <EyeIcon />
    </span>
  );

  return { type, clickElement };
}
