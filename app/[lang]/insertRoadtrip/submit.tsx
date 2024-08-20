import { handleClickType } from "lib/definitions";
import { useFormStatus } from "react-dom";
import { Dict } from "../dictionaries";

const Submit = ({
  handleSubmit,
  loading,
  dict,
}: {
  handleSubmit: handleClickType;
  loading: boolean;
  dict: Dict;
}) => {
  const { insertRoadtrip } = dict;
  const src = loading
    ? insertRoadtrip.insertRoadtripButtonLoading
    : insertRoadtrip.insertRoadtripButton;

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
