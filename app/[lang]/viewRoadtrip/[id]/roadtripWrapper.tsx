import { fetchRoadtripById } from "lib/data";
import MapLoader from "../../../../ui/mapLoader";
import MyMapComponent from "../../../../ui/map";
import Image from "next/image";
import { formatDateToLocal } from "lib/utils/utils";
import Link from "next/link";
import { auth } from "auth";
import { Dict } from "app/[lang]/dictionaries";
import { Suspense } from "react";

export default async function RoadtripWrapper({
  id,
  dict,
}: {
  id: string;
  dict: Dict;
}) {
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
  const { viewRoadtrip } = dict;
  const introduction = JSON.parse(viewRoadtrip.introduction) as string[];

  return (
    <div className="roadtripWrapper">
      <div className="description">
        <div>
          <pre>
            <b>{username}</b> {introduction[0]}{" "}
            <b>
              {starttown}, {startland}
            </b>{" "}
            {introduction[1]}{" "}
            <b>
              {desttown}, {destland}
            </b>
            {introduction[2]}
            <br />
            {introduction[3]} <b>{formatDateToLocal(date)}</b>
            {introduction[4]}
            {sex === "weiblich" ? introduction[6] : introduction[5]}{" "}
            {introduction[7]}
          </pre>
          <p className="description">{description}</p>
        </div>
        {Number(userId) === user_id || userId === undefined ? null : (
          <Link href={`/chat?id=${id}`}>
            <input
              type="image"
              src={viewRoadtrip.sendMessage}
              alt="send Message"
            />
          </Link>
        )}
      </div>
      <div className="image">
        <label htmlFor="Bild">{viewRoadtrip.picture}</label>
        <p> </p>
        <Suspense>
          <Image
            src={image_url}
            alt="roadtripPicture"
            width={150}
            height={300}
          />
        </Suspense>
      </div>
      <div id="map">
        <MapLoader>
          <MyMapComponent roadtrips={roadtrips} />
        </MapLoader>
      </div>
    </div>
  );
}
