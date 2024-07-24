import { RoadtripDisplay } from "app/lib/definitions";
import RoutesTableLine from "app/routesOverview/routesTableLine";
import Image from "next/image";

// Loading animation

export function TableSkeleton() {
  const roadtrip: RoadtripDisplay = {
    id: "",
    date: "",
    description: "",
    destland: "",
    desttown: "",
    image_url: "",
    username: "\n\n",
    startland: "",
    starttown: "",
  };
  const roadtrips: RoadtripDisplay[] = new Array(10).fill(roadtrip);
  const lines = roadtrips.map((roadtrip: RoadtripDisplay) => {
    return <RoutesTableLine key={`line-${roadtrip.id}`} roadtrip={roadtrip} />;
  });

  return (
    <table id="shimmeringList">
      <tbody>{lines}</tbody>
    </table>
  );
}

export function MapSkeleton() {
  return (
    <div id="mapcontent">
      <Image
        src="/routesOverview/loadingmap.gif"
        width={555}
        height={360}
        alt="loading map"
        id="mapSkeleton"
      />
    </div>
  );
}
