import { handleBlurType, months, RoadtripDisplay } from "lib/definitions";
import { Dict } from "../dictionaries";

const DateInput = ({
  handleBlur,
  roadtrip,
  dict,
}: {
  handleBlur?: handleBlurType;
  roadtrip: RoadtripDisplay | null;
  dict: Dict;
}) => {
  const monthsLang = JSON.parse(dict.register.monthsLang);
  const options = months.map((month, i) => (
    <option key={month + i} value={month}>
      {monthsLang[i]}
    </option>
  ));
  const { insertRoadtrip } = dict;

  return (
    <>
      <div className="date">
        <input
          id="day"
          placeholder={insertRoadtrip.day}
          name="day"
          onBlur={handleBlur}
          defaultValue={roadtrip ? new Date(roadtrip.date).getDay() : ""}
        />
        <select
          id="month"
          defaultValue={
            roadtrip ? monthsLang[new Date(roadtrip.date).getMonth()] : ""
          }
          name="month"
          onBlur={handleBlur}
        >
          <option>{insertRoadtrip.month}</option>
          {options}
        </select>
        <input
          id="year"
          placeholder={insertRoadtrip.year}
          name="year"
          onBlur={handleBlur}
          defaultValue={roadtrip ? new Date(roadtrip.date).getFullYear() : ""}
        />
      </div>
    </>
  );
};

export default DateInput;
