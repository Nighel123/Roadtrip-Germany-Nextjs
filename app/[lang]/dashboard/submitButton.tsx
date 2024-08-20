import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="yes" disabled={pending}>
      {pending ? "loading..." : "Ja"}
    </button>
  );
}
