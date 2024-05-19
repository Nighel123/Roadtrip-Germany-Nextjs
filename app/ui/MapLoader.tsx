"use client";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { ReactNode } from "react";
import { MapSkeleton } from "./skeletons";

const render = (status: Status) => {
  if (status === Status.FAILURE) return <p>Error</p>;
  return <MapSkeleton />;
};

export default function MapLoader({ children }: { children: ReactNode }) {
  return (
    <Wrapper apiKey="AIzaSyA-WcuB9Wr6_nOeFrOslc2K0-ZzXwky2dg" render={render}>
      {children}
    </Wrapper>
  );
}
