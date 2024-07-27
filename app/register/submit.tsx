import { handleClickType } from "app/lib/definitions";

const Submit = ({
  handleSubmit,
  loading,
}: {
  handleSubmit: handleClickType;
  loading: boolean;
}) => {
  const img = loading ? "registrierenLoading.jpg" : "registrieren.jpg";
  const src = `/register/${img}`;
  return (
    <input
      type="image"
      id="registrieren"
      onClick={handleSubmit}
      src={src}
      disabled={loading}
    />
  );
};

export default Submit;
