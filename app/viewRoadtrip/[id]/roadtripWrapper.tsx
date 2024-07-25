import { fetchRoadtripById } from "app/lib/data";
import MapLoader from "../../ui/mapLoader";
import MyMapComponent from "../../ui/map";
import Image from "next/image";

export default async function RoadtripWrapper({ id }: { id: string }) {
  const roadtrips = await fetchRoadtripById(id);
  const { description, image_url, username } = roadtrips[0];
  const image = "/uploads/" + id + "." + image_url;

  return (
    <div className="roadtripWrapper">
      <div className="description">
        <label htmlFor="description">
          {username} hat folgendes über diesen Roadtrip geschrieben:
        </label>
        <p className="description">{description}</p>
      </div>
      <Image src={image} alt="roadtripPicture" width={100} height={200} />
      <div id="map">
        <MapLoader>
          <MyMapComponent roadtrips={roadtrips} />
        </MapLoader>
      </div>
    </div>
  );
}
