import { useFormStatus } from "react-dom";
import { Dict } from "../dictionaries";

export default function SubmitButton({ dict }: { dict: Dict }) {
  const { modalRoadtrip } = dict.dashboard.table;
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="yes" disabled={pending}>
      {pending ? modalRoadtrip.loading : modalRoadtrip.yes}
    </button>
  );
}
