import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? session.user.id;
        session.user.role = token.role ?? "MITGLIED";
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const { pathname } = nextUrl;

      if (pathname.startsWith("/login") || pathname.startsWith("/registrieren")) {
        if (isLoggedIn) {
          return Response.redirect(
            new URL(role === "MANAGER" || role === "TEAM" ? "/manager" : "/", nextUrl),
          );
        }
        return true;
      }

      if (pathname.startsWith("/manager")) {
        if (!isLoggedIn) return false;
        if (role !== "MANAGER" && role !== "TEAM") {
          return Response.redirect(new URL("/", nextUrl));
        }
        if (pathname.startsWith("/manager/benutzer") && role !== "MANAGER") {
          return Response.redirect(new URL("/manager", nextUrl));
        }
        return true;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
