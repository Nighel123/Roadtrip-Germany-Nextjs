import { months } from "app/lib/definitions";
import { handleBlurType } from "./form";

const DateInput = ({ handleBlur }: { handleBlur: handleBlurType }) => {
  const options = months.map((month, i) => (
    <option key={month + i} value={month}>
      {month}
    </option>
  ));

  return (
    <>
      <div className="date">
        <input id="day" placeholder="Tag" name="day" onBlur={handleBlur} />
        <select id="month" defaultValue="" name="month" onBlur={handleBlur}>
          <option>Monat</option>
          {options}
        </select>
        <input id="year" placeholder="Jahr" name="year" onBlur={handleBlur} />
      </div>
    </>
  );
};

export default DateInput;
