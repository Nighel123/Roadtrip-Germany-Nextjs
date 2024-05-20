const styleDesctription = {
  height: "100%",
};

const TextInput = () => {
  return (
    <div className="text">
      <textarea id="description" style={styleDesctription} name="description">
        yeah ich bin so ein cooler typ!
      </textarea>
    </div>
  );
};

export default TextInput;
