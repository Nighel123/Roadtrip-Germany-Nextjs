import { handleBlurType, RoadtripDisplay } from "app/lib/definitions";

const AddressInput = ({
  name,
  handleBlur,
  roadtrip,
}: {
  name: "start" | "dest";
  handleBlur: handleBlurType;
  roadtrip: RoadtripDisplay | null;
}) => {
  return (
    <div className="address">
      <input
        id={name + "land"}
        placeholder="Land"
        name={name + "land"}
        onBlur={handleBlur}
        defaultValue={roadtrip ? roadtrip[`${name}land`] : ""}
      />
      <input
        id={name + "town"}
        placeholder="Stadt"
        name={name + "town"}
        onBlur={handleBlur}
        defaultValue={roadtrip ? roadtrip[`${name}town`] : ""}
      />
    </div>
  );
};

export default AddressInput;
