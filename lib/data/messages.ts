import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { auth } from "auth";
import { MessagesDisplay, RoadtripDisplay } from "lib/definitions";

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

export async function setMessagesToInformed({
  senderId,
  recipientId,
  roadtripId,
}: {
  senderId: number;
  recipientId: number;
  roadtripId: string;
}) {
  try {
    const data = await sql`
          UPDATE messages
          SET "userInformed" = NOW()
          WHERE messages.read IS NULL AND "from" = ${senderId} AND "too" = ${recipientId} AND roadtrip = ${roadtripId}
      `;
    return data.rows;
  } catch (error) {
    console.error(error);
    throw new Error("Could not update messages to informed");
  }
}
