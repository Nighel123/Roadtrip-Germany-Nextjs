import { handleBlurType, RoadtripDisplay } from "lib/definitions";

const styleDesctription = {
  height: "100%",
};

const TextInput = ({
  handleBlur,
  roadtrip,
}: {
  handleBlur: handleBlurType;
  roadtrip: RoadtripDisplay | null;
}) => {
  return (
    <div className="text">
      <textarea
        id="description"
        style={styleDesctription}
        name="description"
        onBlur={handleBlur}
        defaultValue={roadtrip ? roadtrip.description : ""}
      ></textarea>
    </div>
  );
};

export default TextInput;
