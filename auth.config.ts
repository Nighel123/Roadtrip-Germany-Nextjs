import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    //newUser: "/", // does not work
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const { pathname } = nextUrl;
      //console.log(auth);
      if (pathname === "/insertRoadtrip") return !!auth;
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
  providers: [], // Add providers with an empty array for now
  //debug: process.env.NODE_ENV !== "production" ? true : false,
} satisfies NextAuthConfig;
