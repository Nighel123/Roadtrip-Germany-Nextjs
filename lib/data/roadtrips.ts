import { sql } from "@vercel/postgres";
import { RoadtripDisplay } from "lib/definitions";
import { unstable_noStore as noStore } from "next/cache";

export async function fetchRoadtrips(query?: string) {
  noStore();
  const search = query ? `%${query}%` : `%`;
  try {
    const data = await sql<RoadtripDisplay>`
      SELECT 
        roadtrips.id,
        roadtrips.created, 
        roadtrips.date AS "roadtripDate", 
        roadtrips.description, 
        roadtrips.image_url, 
        dest.land AS destLand, 
        users.name AS username, 
        users.sex AS sex, 
        dest.town AS destTown, 
        start.land AS startLand, 
        start.town AS startTown
      FROM roadtrips
      JOIN users ON user_id = users.id
      JOIN addresses dest ON dest_id = dest.id
      JOIN addresses start ON start_id = start.id
      WHERE 
        dest.land % ${search} OR dest.land ILIKE ${search} OR
        dest.town % ${search} OR dest.town ILIKE ${search} OR
        start.land % ${search} OR start.land ILIKE ${search} OR
        start.town % ${search} OR start.town ILIKE ${search} OR
        users.name % ${search} OR users.name ILIKE ${search} OR
        roadtrips.date::text%${search} OR roadtrips.date::text ILIKE ${search}
      ORDER BY roadtrips.created DESC
      LIMIT 20
    `;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch roadtrips data.");
  }
}

export async function fetchRoadtripsMap() {
  try {
    const data = await sql<RoadtripDisplay>`
      SELECT 
        roadtrips.id,
        roadtrips.created, 
        roadtrips.date AS "roadtripDate", 
        roadtrips.description, 
        roadtrips.image_url, 
        dest.land AS destLand, 
        users.name AS username, 
        users.sex AS sex, 
        dest.town AS destTown, 
        start.land AS startLand, 
        start.town AS startTown
      FROM roadtrips
      JOIN users ON user_id = users.id
      JOIN addresses dest ON dest_id = dest.id
      JOIN addresses start ON start_id = start.id
      ORDER BY roadtrips.created DESC
      LIMIT 20
    `;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch roadtrips data.");
  }
}

export async function fetchRoadtripsByUserID(userID: string | undefined) {
  noStore();
  if (userID === undefined) return [];
  try {
    const data = await sql<RoadtripDisplay>`
      SELECT roadtrips.id, roadtrips.created, roadtrips.date AS "roadtripDate", roadtrips.description, roadtrips.image_url, dest.land AS destLand, users.name AS username, users.sex AS sex, dest.town AS destTown, start.land AS startLand, start.town AS startTown
      FROM roadtrips
      JOIN users ON user_id = users.id
      JOIN addresses dest ON dest_id = dest.id
      JOIN addresses start ON start_id = start.id
      WHERE user_id = ${userID}
      ORDER BY roadtrips.created DESC
    `;

    // console.log("Data fetch completed after 3 seconds.");

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch roadtrips data.");
  }
}

export async function fetchRoadtripById(id: string | null) {
  noStore();
  if (!id) return [];
  try {
    const data = await sql<RoadtripDisplay>`
      SELECT roadtrips.id, roadtrips.date AS "roadtripDate" , roadtrips.description, roadtrips.image_url, dest_id, start_id ,dest.land AS destLand, users.name AS username, user_id, users.sex AS sex, dest.town AS destTown, start.land AS startLand, start.town AS startTown
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

export async function fetchOldRoadtripImages(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() - 14);
  try {
    const data = await sql<{ image_url: string }>`
            SELECT image_url
                FROM roadtrips
                WHERE date <= ${d.toISOString()}::date
        `;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  }
}

export async function deleteOldRoadtrips(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() - 14);
  try {
    const data = await sql<{ image_url: string }>`
            DELETE
                FROM roadtrips
                WHERE date <= ${d.toISOString()}::date
        `;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  }
}
