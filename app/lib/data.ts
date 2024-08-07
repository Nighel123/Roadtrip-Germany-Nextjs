import { sql } from "@vercel/postgres";
import { MessagesDisplay, RoadtripDisplay } from "./definitions";
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
  try {
    const data = await sql<RoadtripDisplay>`
      SELECT roadtrips.id, roadtrips.date, roadtrips.description, roadtrips.image_url, dest.land AS destLand, users.name AS username, user_id, users.sex AS sex, dest.town AS destTown, start.land AS startLand, start.town AS startTown
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

export async function fetchMessagesByUserId(userId: string) {
  try {
    console.log("fetching messages");

    const data = await sql<MessagesDisplay>`
      SELECT messages.id, messages.text, messages.created, messages.from, messages.to, messages.read, roadtrips.user_id AS "roadtripCreatorId", roadtrip AS "roadtripId" , roadtrips.image_url AS "roadtripImageURL", roadtrips.date AS "roadtripDate", dest.land AS "destLand", dest.town AS "destTown", start.land AS "startLand", start.town AS "startTown", other.id AS "otherUserId", other.name AS "otherUserName"
      FROM messages
      JOIN users AS other ON (messages.from <> ${userId} AND messages.from = other.id) OR (messages.to <> ${userId} AND messages.to = other.id)
      JOIN roadtrips ON roadtrip = roadtrips.id
      JOIN addresses AS dest ON dest_id = dest.id
      JOIN addresses AS start ON start_id = start.id
      WHERE messages.from = ${userId} OR messages.to = ${userId}
      ORDER BY roadtrip DESC, messages.created DESC
    `;

    return data.rows as MessagesDisplay[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch messages data.");
  }
}

export async function insertMessage(newMessage: {
  text: string;
  from: string;
  to: number;
  roadtrip: string;
}) {
  const { text, from, to, roadtrip } = newMessage;
  try {
    const res = await sql`
      INSERT INTO messages ("text", "from", "to", "roadtrip")
      VALUES (${text}, ${from}, ${to}, ${roadtrip})
      `;
    return res;
  } catch (error) {
    throw new Error("An Error occurred inserting the message: " + error);
  }
}
