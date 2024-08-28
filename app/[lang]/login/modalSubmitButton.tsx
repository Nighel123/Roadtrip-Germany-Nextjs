import { useFormStatus } from "react-dom";
import { Dict } from "../dictionaries";

export default function ModalSubmitButton({ dict }: { dict: Dict }) {
  const { pending } = useFormStatus();

  return (
    <input
      type="submit"
      id="pwResetButton"
      className="button"
      value={pending ? "loading" : "submit"}
      disabled={pending}
    />
  );
}
