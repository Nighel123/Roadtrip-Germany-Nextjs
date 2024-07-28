import { sql } from "@vercel/postgres";
import { RoadtripDisplay } from "./definitions";
import { unstable_noStore as noStore } from "next/cache";

export async function fetchRoadtrips() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    //console.log("Fetching roadtrips data...");
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    //so schreibt man also ein Promise!

    const data = await sql<RoadtripDisplay>`
      SELECT roadtrips.id,roadtrips.created, roadtrips.date, roadtrips.description, roadtrips.image_url, dest.land AS destLand, users.name AS username, users.sex AS sex, dest.town AS destTown, start.land AS startLand, start.town AS startTown
      FROM roadtrips
      JOIN users ON user_id = users.id
      JOIN addresses dest ON dest_id = dest.id
      JOIN addresses start ON start_id = start.id
      ORDER BY roadtrips.created DESC
      LIMIT 20
    `;

    // console.log("Data fetch completed after 3 seconds.");

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch roadtrips data.");
  }
}

export async function fetchRoadtripById(id: string) {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  //noStore();

  try {
    const data = await sql<RoadtripDisplay>`
      SELECT roadtrips.id, roadtrips.date, roadtrips.description, roadtrips.image_url, dest.land AS destLand, users.name AS username, users.sex AS sex, dest.town AS destTown, start.land AS startLand, start.town AS startTown
      FROM roadtrips
      JOIN users ON user_id = users.id
      JOIN addresses dest ON dest_id = dest.id
      JOIN addresses start ON start_id = start.id
      WHERE roadtrips.id = ${id}
    `;

    // console.log("Data fetch completed after 3 seconds.");

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch roadtrips data with given id.");
  }
}
