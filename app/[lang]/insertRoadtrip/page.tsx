/* css */
import "@/styles/insertRoadtrip.css";
import "@/styles/insertRoadtripForm.css";

/* components */
import Image from "next/image";
import InsertForm from "./insertForm";
import { Metadata } from "next";
import { fetchRoadtripById } from "lib/data/roadtrips";
import Title from "ui/components/title";
import { getDictionary } from "../dictionaries";

export const metadata: Metadata = {
  title: "Roadtrip eintragen",
};

const InsertRoadtrip = async ({
  searchParams,
  params: { lang },
}: {
  searchParams?: {
    id?: string;
  };
  params: { lang: "de" | "en" };
}) => {
  let roadtrip = null;
  const id = searchParams?.id;
  if (id) {
    roadtrip = (await fetchRoadtripById(id))[0];
  }
  const dict = await getDictionary(lang);
  const { insertRoadtrip } = dict;

  return (
    <div className="insertRoadtrip" data-testid="insertRoadtrip">
      <header>
        <h1 id="heading">{insertRoadtrip.heading}</h1>
        <Title />
      </header>

      <Image
        id="insertRoadtripImage"
        src="/images/insertRoadtrip/insertRoadtripImage.jpg"
        alt="australian roads"
        width={1006}
        height={850}
      />
      <InsertForm roadtrip={roadtrip} dict={dict} />
    </div>
  );
};

export default InsertRoadtrip;
