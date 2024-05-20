const AddressInput = ({ name }: { name: "start" | "dest" }) => {
  return (
    <div className="address">
      <input id={name + "land"} placeholder="Land" name={name + "land"} />
      <input id={name + "town"} placeholder="Stadt" name={name + "town"} />
    </div>
  );
};

export default AddressInput;
