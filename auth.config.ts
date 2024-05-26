import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/", // does not work
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const { pathname } = nextUrl;
      if (pathname === "/insertRoadtrip") return !!auth;
      return true;
    },
    async redirect({ url, baseUrl }) {
      return "/";
    },
  },
  providers: [], // Add providers with an empty array for now
  debug: process.env.NODE_ENV !== "production" ? true : false,
} satisfies NextAuthConfig;
