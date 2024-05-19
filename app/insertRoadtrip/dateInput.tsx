import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export const months = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

const DateInput = () => {
  return (
    <div className="date">
      <input id="day" placeholder="Tag" />
      <Dropdown options={months} placeholder="Monat" />
      <input id="year" placeholder="Jahr" />
    </div>
  );
};

export default DateInput;
