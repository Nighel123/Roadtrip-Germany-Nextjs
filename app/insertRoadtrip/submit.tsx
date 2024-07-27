import { handleClickType } from "app/lib/definitions";
import { useFormStatus } from "react-dom";

const Submit = ({
  handleSubmit,
  loading,
}: {
  handleSubmit: handleClickType;
  loading: boolean;
}) => {
  return (
    <div className="submit">
      <input
        type="image"
        src="/insertRoadtrip/roadtripEintragen.jpg"
        alt="submit"
        onClick={handleSubmit}
        disabled={loading}
      />
    </div>
  );
};

export default Submit;
