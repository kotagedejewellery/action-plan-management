import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authenticateUser } from "@/application/use-cases";
import type { AccountStatus, UserRole } from "@/domain/models";
import { users } from "@/infrastructure/container";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  pages: { signIn: "/login" },
  providers: [Credentials({
    credentials: { email: { type: "email" }, password: { type: "password" } },
    async authorize(credentials) {
      const email = typeof credentials?.email === "string" ? credentials.email : "";
      const password = typeof credentials?.password === "string" ? credentials.password : "";
      const user = await authenticateUser(users, email, password);
      return user ? { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status } : null;
    },
  })],
  callbacks: {
    jwt({ token, user }) {
      if (user) { token.role = user.role as UserRole; token.status = user.status as AccountStatus; }
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user = { ...session.user, id: token.sub!, name: session.user.name ?? "", email: session.user.email ?? "", role: (token.role as UserRole | undefined) ?? "user", status: (token.status as AccountStatus | undefined) ?? "inactive" };
      return session;
    },
  },
});
