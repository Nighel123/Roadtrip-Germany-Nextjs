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
    <Wrapper
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""}
      render={render}
    >
      {children}
    </Wrapper>
  );
}
