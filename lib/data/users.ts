"use server";

import { sql, VercelPoolClient } from "@vercel/postgres";
import { randomUUID } from "node:crypto";
import { unstable_noStore as noStore } from "next/cache";
import { getLocale } from "middleware";
import { headers } from "next/headers";

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
            SELECT 
              recipient.email, 
              recipient.lang, 
              recipient.name AS "recipientName", 
              messages.text, 
              messages.id,
              sender.name AS "senderName", 
              messages.created AS "messageCreated"
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
      lang: "de" | "en";
      id: string;
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

export async function setUserLangById(user_id: string) {
  const lang = getLocale(headers());
  try {
    const res = await sql`
      UPDATE users 
      SET lang = ${lang} 
      WHERE id = ${user_id}`;
    return res.rowCount;
  } catch (error) {
    console.error(error);
    throw new Error("Die Email konnte nicht auf verifiziert gesetzt werden.");
  }
}
