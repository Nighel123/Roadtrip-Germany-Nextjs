import Title from "ui/components/title";
import { getDictionary } from "../dictionaries";

export default async function Impressum({
  params: { lang },
}: {
  params: { lang: "en" | "de" };
}) {
  const dict = await getDictionary(lang);
  const { imprint } = dict;
  return (
    <>
      <Title />
      <p>
        <strong>{imprint.headline}</strong>
      </p>
      <p>
        {imprint.provider}
        <br />
        Nickel Paulsen
        <br />
        Stuttgart
      </p>
      <p>
        {imprint.contact} E-Mail: roadtrip.german.road@gmail.com
        <br />
        Website: www.roadtrip-germany.de
      </p>
      <p> </p>
      <p>{imprint.editorialContent}</p>
      <p>
        {imprint.responsible} § 55 Abs.2 RStV
        <br />
        Nickel Paulsen
      </p>
    </>
  );
}
