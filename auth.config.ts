import type { NextAuthConfig } from "next-auth";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";

export const authConfig = {
  pages: {
    signIn: "/login",
    //newUser: "/", // does not work
  },
  callbacks: {
    authorized({ auth, request }) {
      //if (request.nextUrl.pathname.endsWith("Overview.jpg"))
      //console.log(request.nextUrl);
      const { pathname } = request.nextUrl;
      //console.log(auth);
      /* const forbiddenURL = ["insertRoadtrip", "chat", "dashboard"];
        if (
          forbiddenURL.some((path) => {
            const regex = new RegExp(`.*(${path}).*`, "gm");
            return regex.test(pathname);
          })
        )
          return NextResponse.next(); */
      const forbiddenURL = ["/insertRoadtrip", "/chat", "/dashboard"];
      if (forbiddenURL.some((path) => pathname.endsWith(path))) return !!auth;

      return true;
    } /* ,
    async redirect({ url, baseUrl }) {
      console.log("url: ", url, "baseUrl: ", baseUrl);
      return url;
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log(
        "user: ",
        user,
        "account: ",
        account,
        "profile: ",
        profile,
        "email: ",
        email,
        "credentials: ",
        credentials
      );
      return true;
    }, */,
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  providers: [], // Add providers with an empty array for now
  //debug: process.env.NODE_ENV !== "production" ? true : false,
} satisfies NextAuthConfig;
