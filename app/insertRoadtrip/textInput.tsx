import { handleBlurType } from "app/lib/definitions";

const styleDesctription = {
  height: "100%",
};

const TextInput = ({ handleBlur }: { handleBlur: handleBlurType }) => {
  return (
    <div className="text">
      <textarea
        id="description"
        style={styleDesctription}
        name="description"
        onBlur={handleBlur}
      ></textarea>
    </div>
  );
};

export default TextInput;
