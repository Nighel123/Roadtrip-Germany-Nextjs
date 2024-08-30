"use server";

import { sql, VercelPoolClient } from "@vercel/postgres";
import { randomUUID } from "node:crypto";
import { unstable_noStore as noStore } from "next/cache";

export async function generateVerificationToken({
  user_id,
  client,
}: {
  user_id: string;
  client?: VercelPoolClient;
}) {
  const token = randomUUID();
  try {
    if (!client) {
      await sql`
        INSERT INTO verification_token (identifier, token, user_id)
        VALUES (uuid_generate_v4(), ${token}, ${user_id})
    `;
    } else {
      await client.sql`
        INSERT INTO verification_token (identifier, token, user_id)
        VALUES (uuid_generate_v4(), ${token}, ${user_id})
    `;
    }
    return token;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserbyEmail(email: string) {
  try {
    const {
      rows: [{ id: user_id, name: username, emailVerified: emailVerified }],
    } = await sql`
      SELECT id, name, "emailVerified" FROM users WHERE email = ${email} 
    `;
    return { user_id, username, emailVerified } as {
      user_id: string;
      username: string;
      emailVerified: string;
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUsersWithUnreadEmails() {
  noStore();
  try {
    const data = await sql`
            SELECT recipient.email, recipient.name AS "recipientName", messages.text, sender.name AS "senderName", messages.created AS "messageCreated"
            FROM messages
            JOIN users AS recipient ON messages.to = recipient.id
            JOIN users AS sender ON messages.from = sender.id
            WHERE messages.read IS NULL AND messages."userInformed" IS NULL
            ORDER BY messages.created DESC 
      `;
    return data.rows as {
      email: string;
      text: string;
      senderName: string;
      recipientName: string;
      messageCreated: string;
    }[];
  } catch (error) {
    console.error(error);
    throw new Error("Could not get users with unread emails");
  }
}

export async function deleteUnverifiedUsers() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  try {
    sql`DELETE FROM users WHERE "emailVerified" IS NULL AND password IS NOT NULL AND created <= ${d.toISOString()}::date`;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
