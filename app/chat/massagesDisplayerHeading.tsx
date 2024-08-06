import MapLoader from "app/ui/mapLoader";
import MyMapComponent from "../ui/map";
import { MessagesDisplay, RoadtripDisplay } from "app/lib/definitions";
import Image from "next/image";

export default function MessageDisplayerHeading({
  headingInfo,
}: {
  headingInfo: MessagesDisplay | null;
}) {
  if (!headingInfo) return <p>No Message yet selected.</p>;
  const {
    otherUserName,
    startLand,
    startTown,
    destLand,
    destTown,
    roadtripImageURL,
    roadtripCreatorId,
  } = headingInfo;
  const roadtripUserName =
    roadtripCreatorId === 7 ? "Nighel1234" : otherUserName;
  const roadtrip = {
    startland: startLand,
    starttown: startTown,
    destland: destTown,
    desttown: destTown,
    username: roadtripUserName,
  } as unknown as RoadtripDisplay;
  return (
    <div id="routeInfo">
      <MapLoader>
        <MyMapComponent roadtrips={[roadtrip]} />
      </MapLoader>
      <Image
        src={roadtripImageURL}
        alt="roadtripPicture"
        width={150}
        height={300}
      />
      <h1 className="name">{otherUserName}</h1>
      <p>
        {startLand},{startTown} &#8594; {destLand},{destTown}
      </p>
    </div>
  );
}
