import { handleBlurType, RoadtripDisplay } from "lib/definitions";
import { Dict } from "../dictionaries";

const AddressInput = ({
  name,
  handleBlur,
  roadtrip,
  dict,
}: {
  name: "start" | "dest";
  handleBlur: handleBlurType;
  roadtrip: RoadtripDisplay | null;
  dict: Dict;
}) => {
  const { insertRoadtrip } = dict;
  return (
    <div className="address">
      <input
        id={name + "land"}
        placeholder={insertRoadtrip.land}
        name={name + "land"}
        onBlur={handleBlur}
        defaultValue={roadtrip ? roadtrip[`${name}land`] : ""}
      />
      <input
        id={name + "town"}
        placeholder={insertRoadtrip.town}
        name={name + "town"}
        onBlur={handleBlur}
        defaultValue={roadtrip ? roadtrip[`${name}town`] : ""}
      />
    </div>
  );
};

export default AddressInput;
