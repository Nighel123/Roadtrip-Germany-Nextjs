import { handleBlurType, months, RoadtripDisplay } from "lib/definitions";

const DateInput = ({
  handleBlur,
  roadtrip,
}: {
  handleBlur?: handleBlurType;
  roadtrip: RoadtripDisplay | null;
}) => {
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
          defaultValue={roadtrip ? new Date(roadtrip.date).getDay() : ""}
        />
        <select
          id="month"
          defaultValue={
            roadtrip ? months[new Date(roadtrip.date).getMonth()] : ""
          }
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
          defaultValue={roadtrip ? new Date(roadtrip.date).getFullYear() : ""}
        />
      </div>
    </>
  );
};

export default DateInput;
