import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { sql } from "@vercel/postgres";
import type { User } from "lib/definitions";
import bcrypt from "bcrypt";
import {
  deleteVerificationTokenByUserId,
  getVerificationTokenByUserIdAndToken,
  verifyUserEmail,
} from "lib/data/data";
import google from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";

async function getUser(username: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE name=${username}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  ssl: true,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  adapter: PostgresAdapter(pool),
  providers: [
    google,
    Credentials({
      async authorize(credentials) {
        /* this function will be called from the signIn-function */
        //const nextUrl: NextURL = request.nextUrl;
        const { username, password, verificationToken } = credentials as {
          username: string;
          password: string;
          redirectTo: string;
          verificationToken: string;
        };
        /* console.log(verificationToken); */
        const user = await getUser(username);
        if (!user) return null;
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          //Response.redirect(new URL("/dashboard", request.nextUrl));
          if (user.emailVerified) {
            return user;
          } else {
            if (verificationToken) {
              try {
                await getVerificationTokenByUserIdAndToken(
                  user.id,
                  verificationToken
                );
                await verifyUserEmail(user.id);
                await deleteVerificationTokenByUserId(user.id);
                return user;
              } catch (error) {
                console.error(error);
                throw error;
              }
            }
          }
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
