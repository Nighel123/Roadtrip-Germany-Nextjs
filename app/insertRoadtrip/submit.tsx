import { handleClickType } from "app/lib/definitions";
import { useFormStatus } from "react-dom";

const Submit = ({
  handleSubmit,
  loading,
}: {
  handleSubmit: handleClickType;
  loading: boolean;
}) => {
  const img = loading
    ? "roadtripEintragenLoading.jpg"
    : "roadtripEintragen.jpg";
  const src = `/insertRoadtrip/${img}`;
  return (
    <div className="submit">
      <input
        type="image"
        src={src}
        alt="submit"
        onClick={handleSubmit}
        disabled={loading}
      />
    </div>
  );
};

export default Submit;
