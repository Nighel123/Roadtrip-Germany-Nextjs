import { useEffect } from "react";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  useEffect(() => {
    console.log(pending);
  }, [pending]);

  return (
    <input
      type="submit"
      id="logIn"
      className="button"
      value="einloggen"
      disabled={pending}
    />
  );
}
