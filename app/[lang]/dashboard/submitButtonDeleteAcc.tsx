import { useFormStatus } from "react-dom";

export default function SubmitButtonDeleteAcc() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="yes delete" disabled={pending}>
      {pending ? "loading..." : "Account Löschen"}
    </button>
  );
}
