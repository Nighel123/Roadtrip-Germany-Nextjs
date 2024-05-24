import { arrIntersection } from "app/lib/utils";
import { error } from "./utils";

export default function ErrorComponent({
  errors,
  touched,
  show,
}: {
  errors: error[];
  touched: string[];
  show: string[];
}) {
  //get only the errors allowd by touched
  const fshow = arrIntersection(show, touched);
  const fErrors = errors.filter(
    (error) => arrIntersection(fshow, error.path).length
  );
  const ErrorList = fErrors.map((error, index) => {
    return (
      <p key={index + touched.join(", ")} className="errorMssg">
        {error.message}
      </p>
    );
  });
  return <>{ErrorList}</>;
}
