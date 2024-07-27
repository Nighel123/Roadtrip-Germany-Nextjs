import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <input
      type="submit"
      id="logIn"
      className="button"
      value={pending ? "loading..." : "einloggen"}
      disabled={pending}
    />
  );
}
