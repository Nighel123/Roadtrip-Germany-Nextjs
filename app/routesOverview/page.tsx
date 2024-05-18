import { fetchRoadtrips } from "app/lib/data";
import { Roadtrip, RoadtripDisplay } from "app/lib/definitions";
import Image from "next/image";
import Link from "next/link";
import RoutesTableLine from "./RoutesTableLine";

export default async function RoutesOverview() {
  const roadtrips = await fetchRoadtrips();

  const lines = roadtrips.map((roadtrip: RoadtripDisplay) => {
    return <RoutesTableLine key={`line-${roadtrip.id}`} roadtrip={roadtrip} />;
    /* return <p>{roadtrip.username}</p>; */
  });

  return (
    <div className="routesOverview" data-testid="routesOverview">
      <Link href="/">
        <Image src="/title.jpg" alt="title" width={1374} height={567} />
      </Link>

      <Image
        src="/routesOverview/blueFrame.jpg"
        alt="blueFrame"
        width={740}
        height={444}
      />
      <div id="table">
        <table id="roadtripslist" /* style={{ border-collapse:"collapse" }} */>
          <tbody>{lines}</tbody>
        </table>
      </div>

      <Image
        src="/routesOverview/redFrame.jpg"
        alt="redFrame"
        width={2486}
        height={1699}
      />
      <div id="map"></div>

      <Image
        src="/routesOverview/eigeneReiseMachen.jpg"
        alt="insertRoadtrip"
        width={662}
        height={147}
      />

      <Image
        src="/routesOverview/reiseAnsehen.jpg"
        alt="routesDetailed"
        width={662}
        height={145}
      />

      <Image
        src="/routesOverview/img1.jpg"
        alt="img1"
        width={2048}
        height={783}
      />
      <Image
        src="/routesOverview/img2.jpg"
        alt="img2"
        width={1536}
        height={345}
      />
    </div>
  );
}
