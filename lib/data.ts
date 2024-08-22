import { sql } from "@vercel/postgres";
import { MessagesDisplay, RoadtripDisplay } from "./definitions";
import { unstable_noStore as noStore } from "next/cache";
import { auth } from "auth";

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
      SELECT roadtrips.id,roadtrips.created, roadtrips.date AS "roadtripDate", roadtrips.description, roadtrips.image_url, dest.land AS destLand, users.name AS username, users.sex AS sex, dest.town AS destTown, start.land AS startLand, start.town AS startTown
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

export async function fetchMessagesByUserId(userId: string) {
  noStore();
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
      ORDER BY roadtrip DESC, "otherUserId" DESC
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

export async function fetchNewMessagesCountByUserId(
  userId: string | undefined
): Promise<string> {
  noStore();
  try {
    if (!userId) return "0";
    console.log("fetching messages");

    const data = await sql`
      SELECT count(*)
      FROM messages
      WHERE messages.to = ${userId} AND "read" IS NULL 
    `;

    return data.rows[0].count as string;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to count unread messages.");
  }
}

export async function updateReadStatus(o: {
  from: number;
  roadtripId: string;
}) {
  const userId = (await auth())?.user?.id;
  if (!userId) return 0;
  const { from, roadtripId } = o;
  try {
    const data = await sql`
      UPDATE messages
      SET read = ${new Date().toDateString()}
      WHERE messages.to = ${userId} AND messages.from = ${from} AND messages.roadtrip = ${roadtripId} AND "read" IS NULL
    `;

    return data.rowCount;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update message data.");
  }
}

export async function getVerificationTokenByUserIdAndToken(
  userId: string,
  token: string
) {
  try {
    return (
      await sql`
            SELECT * FROM verification_token 
            WHERE user_id = ${userId} AND token = ${token}
         `
    ).rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Falscher token.");
  }
}
export async function deleteVerificationTokenByUserId(userId: string) {
  try {
    await sql`
            DELETE FROM verification_token 
            WHERE user_id = ${userId}
         `;
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting token with userId: " + userId);
  }
}

export async function verifyUserEmail(user_id: string) {
  try {
    const res = await sql`
      UPDATE users 
      SET "emailVerified" = ${new Date().toISOString()} 
      WHERE id = ${user_id}`;
    return res.rowCount;
  } catch (error) {
    console.error(error);
    throw new Error("Die Email konnte nicht auf verifiziert gesetzt werden.");
  }
}

export async function getUsersWithUnreadEmails() {
  try {
    const data = await sql`
          SELECT recipient.email, recipient.name AS "recipientName", messages.text, sender.name AS "senderName"
          FROM messages
          JOIN users AS recipient ON messages.to = users.id
          JOIN users AS sender ON messages.from = users.id
          WHERE messages.read IS NULL AND messages."userInformed" IS NULL
      `;
    return data.rows as {
      email: string;
      text: string;
      senderName: string;
      recipientName: string;
    }[];
  } catch (error) {
    console.error(error);
    throw new Error("Could not get users with unread emails");
  }
}

export async function setMessagesToInformed() {
  try {
    const data = await sql`
          UPDATE messages
          SET "userInformed" = NOW()s
          WHERE messages.read IS NULL
      `;
    return data.rows;
  } catch (error) {
    console.error(error);
    throw new Error("Could not get users with unread emails");
  }
}
