import { useFormStatus } from "react-dom";
import { Dict } from "../dictionaries";

export default function SubmitButton({ dict }: { dict: Dict }) {
  const { pending } = useFormStatus();
  const { logIn } = dict;

  return (
    <input
      type="submit"
      id="logIn"
      className="button"
      value={pending ? logIn.loginLoading : logIn.loginButton}
      disabled={pending}
    />
  );
}
