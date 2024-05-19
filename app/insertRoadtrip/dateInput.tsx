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
  const options = months.map((month, i) => (
    <option key={month + i} value={month}>
      {month}
    </option>
  ));

  return (
    <div className="date">
      <input id="day" placeholder="Tag" />
      <select id="month" defaultValue="">
        <option value="">Monat</option>
        {options}
      </select>
      <input id="year" placeholder="Jahr" />
    </div>
  );
};

export default DateInput;
