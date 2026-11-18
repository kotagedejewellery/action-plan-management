import "next-auth";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: "admin" | "bod" | "user"; status: "active" | "inactive"; name: string; email: string };
  }

  interface User {
    role: "admin" | "bod" | "user";
    status: "active" | "inactive";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "bod" | "user";
    status?: "active" | "inactive";
  }
}
