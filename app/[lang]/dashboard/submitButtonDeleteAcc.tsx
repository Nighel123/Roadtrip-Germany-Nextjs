import { useFormStatus } from "react-dom";
import { Dict } from "../dictionaries";

export default function SubmitButtonDeleteAcc({
  dict,
  blockSubmit,
}: {
  dict: Dict;
  blockSubmit: boolean;
}) {
  const { pending } = useFormStatus();
  const { modalUser } = dict.dashboard;
  return (
    <button
      type="submit"
      className={pending || blockSubmit ? "disabled yes delete" : "yes delete"}
      disabled={pending || blockSubmit}
    >
      {pending ? modalUser.loading : modalUser.button}
    </button>
  );
}
