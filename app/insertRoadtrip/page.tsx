/* css */
import "@/styles/insertRoadtrip.css";
import "@/styles/insertRoadtripForm.css";

/* components */
import Image from "next/image";
import Form from "./form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadtrip eintragen",
};

const InsertRoadtrip = () => {
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
      <Form />
    </div>
  );
};

export default InsertRoadtrip;
