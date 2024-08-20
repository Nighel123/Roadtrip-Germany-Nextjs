import { handleClickType } from "lib/definitions";
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
  const { register } = dict;
  const src = loading
    ? register.registerButtonLoading
    : register.registerButton;
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
