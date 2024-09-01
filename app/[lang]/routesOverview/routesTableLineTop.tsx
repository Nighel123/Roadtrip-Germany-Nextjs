import { Dict } from "../dictionaries";

export function RoutesTableLineTop({ dict }: { dict: Dict }) {
  const {
    routesOverview: {
      table: { user, start, goal, date },
    },
  } = dict;
  return (
    <div className="tableRow top">
      <div className="tableItem">{user}</div>
      <div className="tableItem">{start}</div>
      <div className="tableItem">{goal}</div>
      <div className="tableItem">{date}</div>
    </div>
  );
}
