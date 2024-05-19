/* css */
import "@/styles/insertRoadtrip.css";
import "@/styles/insertRoadtripForm.css";

/* components */
import AddressInput from "./addressInput";
import DateInput from "./dateInput";
import TextInput from "./textInput";
import ImageUpload from "./imageUpload";
import Submit from "./submit";

const InsertRoadtrip: React.FC = () => {
  return (
    <div className="insertRoadtrip" data-testid="insertRoadtrip">
      <header>
        <h1 id="heading">erstelle deinen eigenen Roadtrip</h1>
      </header>

      <img
        id="insertRoadtripImage"
        src={insertRoadtripImage}
        alt="australian roads"
      />
      <form id="insertRoadtripForm">
        <p>Wo wollt ihr losfahren?</p>
        <AddressInput />

        <p>Wo wollt ihr hin?</p>
        <AddressInput />

        <p>Wann wollt ihr losfahren?</p>
        <DateInput />
        <p>
          Beschreibe in einem Text wer du bist und was du auf deiner Reise
          vorhast:
        </p>
        <TextInput />

        <ImageUpload />

        <Submit />
      </form>
    </div>
  );
};

export default InsertRoadtrip;
