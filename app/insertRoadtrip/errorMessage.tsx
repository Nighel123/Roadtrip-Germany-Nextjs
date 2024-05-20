export default function errorMessage({
  errors,
}: {
  errors: string[] | undefined;
}) {
  if (!errors) return null;
  return errors.map((error: string) => (
    <p key={error} className="errorMssg">
      {error}
    </p>
  ));
}
