import { handleBlurType, months } from "app/lib/definitions";

const DateInput = ({ handleBlur }: { handleBlur?: handleBlurType }) => {
  const options = months.map((month, i) => (
    <option key={month + i} value={month}>
      {month}
    </option>
  ));

  return (
    <>
      <div className="date">
        <input
          id="day"
          placeholder="Tag"
          name="day"
          onBlur={handleBlur}
          defaultValue={"1"}
        />
        <select
          id="month"
          defaultValue="Januar"
          name="month"
          onBlur={handleBlur}
        >
          <option>Monat</option>
          {options}
        </select>
        <input
          id="year"
          placeholder="Jahr"
          name="year"
          onBlur={handleBlur}
          defaultValue={"2025"}
        />
      </div>
    </>
  );
};

export default DateInput;
