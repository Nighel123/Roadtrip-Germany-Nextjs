/* css */
import "@/styles/success.css";
import { getDictionary } from "app/[lang]/dictionaries";
import Title from "ui/components/title";

const Success = async ({
  params: { context, lang },
}: {
  params: { context: "resend-validation" | "new-password"; lang: "en" | "de" };
}) => {
  const { success } = await getDictionary(lang);

  return (
    <div className="success">
      <Title />
      <header>
        <h1>{success[context].headline}</h1>
        <p>{success[context].paragraph}</p>
      </header>
    </div>
  );
};

export default Success;
