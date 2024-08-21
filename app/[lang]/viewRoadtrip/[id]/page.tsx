import { Suspense } from "react";

import "@/styles/viewRoadtrip.css";
import RoadtripWrapper from "./roadtripWrapper";
import { Metadata } from "next";
import Title from "ui/components/title";
import { getDictionary } from "app/[lang]/dictionaries";

export const metadata: Metadata = {
  title: "Roadtrip anschauen",
};

export default async function ViewRoadtrip({
  params,
}: {
  params: { id: string; lang: "en" | "de" };
}) {
  const { id, lang } = params;
  const dict = await getDictionary(lang);

  return (
    <div className="viewRoadtrip" data-testid="viewRoadtrip">
      <Title />

      <Suspense>
        <RoadtripWrapper id={id} dict={dict} />
      </Suspense>
    </div>
  );
}
