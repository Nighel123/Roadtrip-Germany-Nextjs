import { fetchRoadtripById } from "lib/data";
import MapLoader from "../../../ui/mapLoader";
import MyMapComponent from "../../../ui/map";
import Image from "next/image";
import { formatDateToLocal } from "lib/utils";
import Link from "next/link";
import { auth } from "auth";

export default async function RoadtripWrapper({ id }: { id: string }) {
  const userId = (await auth())?.user?.id;
  const roadtrips = await fetchRoadtripById(id);
  const {
    description,
    image_url,
    username,
    startland,
    starttown,
    destland,
    desttown,
    date,
    sex,
    user_id,
  } = roadtrips[0];

  return (
    <div className="roadtripWrapper">
      <div className="description">
        <div>
          <label htmlFor="description">
            <b>{username}</b> möchte einen Roadtrip von{" "}
            <b>
              {starttown}, {startland}
            </b>{" "}
            nach{" "}
            <b>
              {desttown}, {destland}
            </b>{" "}
            machen. Es soll am <b>{formatDateToLocal(date)}</b> losgehen.{" "}
            {sex === "weiblich" ? "Sie" : "Er"} hat folgendes dazu geschrieben:
          </label>
          <p className="description">{description}</p>
        </div>
        {Number(userId) === user_id || userId === undefined ? null : (
          <Link href={`/chat?id=${id}`}>
            <input type="image" src="sendMessage.png" alt="send Message" />
          </Link>
        )}
      </div>
      <div className="image">
        <label htmlFor="Bild">
          Das Bild das <b>{username}</b> zu diesem Roadtrip hochgeladen hat
          sieht folgendermaßen aus:
        </label>
        <p> </p>
        <Image src={image_url} alt="roadtripPicture" width={150} height={300} />
      </div>
      <div id="map">
        <MapLoader>
          <MyMapComponent roadtrips={roadtrips} />
        </MapLoader>
      </div>
    </div>
  );
}
