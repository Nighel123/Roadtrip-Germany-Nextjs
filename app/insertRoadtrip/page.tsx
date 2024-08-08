/* css */
import "@/styles/insertRoadtrip.css";
import "@/styles/insertRoadtripForm.css";

/* components */
import Image from "next/image";
import InsertForm from "./insertForm";
import { Metadata } from "next";
import { fetchRoadtripById } from "app/lib/data";

export const metadata: Metadata = {
  title: "Roadtrip eintragen",
};

const InsertRoadtrip = async ({
  searchParams,
}: {
  searchParams?: {
    id?: string;
  };
}) => {
  let roadtrip = null;
  const id = searchParams?.id;
  if (id) {
    roadtrip = (await fetchRoadtripById(id))[0];
  }

  return (
    <div className="insertRoadtrip" data-testid="insertRoadtrip">
      <header>
        <h1 id="heading">erstelle deinen eigenen Roadtrip</h1>
      </header>

      <Image
        id="insertRoadtripImage"
        src="/insertRoadtrip/insertRoadtripImage.jpg"
        alt="australian roads"
        width={1006}
        height={850}
      />
      <InsertForm roadtrip={roadtrip} />
    </div>
  );
};

export default InsertRoadtrip;
