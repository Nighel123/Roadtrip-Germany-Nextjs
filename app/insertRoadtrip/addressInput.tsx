import { handleBlurType } from "app/lib/definitions";

const AddressInput = ({
  name,
  handleBlur,
}: {
  name: "start" | "dest";
  handleBlur: handleBlurType;
}) => {
  return (
    <div className="address">
      <input
        id={name + "land"}
        placeholder="Land"
        name={name + "land"}
        onBlur={handleBlur}
      />
      <input
        id={name + "town"}
        placeholder="Stadt"
        name={name + "town"}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default AddressInput;
