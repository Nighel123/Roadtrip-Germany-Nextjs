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
      >
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet.
      </textarea>
    </div>
  );
};

export default TextInput;
