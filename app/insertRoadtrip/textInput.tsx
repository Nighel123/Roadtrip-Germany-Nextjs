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
        yeah ich bin so ein cooler typ! Und ich kann fliegen und bin noch cooler
        als ihr alle. UUnd
        aspofjhwpqoeuihruhfkjandvpiuiahsepfijnpqwi3uhrpijn;afksjfhdpiuhasefpoiuijnew4
      </textarea>
    </div>
  );
};

export default TextInput;
