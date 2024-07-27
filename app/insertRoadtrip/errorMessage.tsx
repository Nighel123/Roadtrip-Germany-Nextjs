import { arrIntersection } from "app/lib/utils";
import { error } from "./utils";

export default function ErrorComponent({
  errors,
  show,
}: {
  errors: error[];
  show: string[];
}) {
  //get only the errors allowd by touched
  const fErrors = errors.filter(
    (error) => arrIntersection(show, error.path).length
  );
  const ErrorList = fErrors.map((error, index) => {
    return (
      <p key={index + show.join(", ")} className="errorMssg">
        {error.message}
      </p>
    );
  });
  return <>{ErrorList}</>;
}
