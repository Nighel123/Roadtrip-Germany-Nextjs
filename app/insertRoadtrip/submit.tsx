import { handleClickType } from "app/lib/definitions";

const Submit = ({ handleSubmit }: { handleSubmit: handleClickType }) => {
  return (
    <div className="submit">
      <input
        type="image"
        src="/insertRoadtrip/roadtripEintragen.jpg"
        alt="submit"
        onClick={handleSubmit}
      />
    </div>
  );
};

export default Submit;
