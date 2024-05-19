const styleDesctription = {
  height: "100%",
};

const TextInput = () => {
  return (
    <div className="text">
      <textarea id="description" style={styleDesctription}></textarea>
    </div>
  );
};

export default TextInput;
