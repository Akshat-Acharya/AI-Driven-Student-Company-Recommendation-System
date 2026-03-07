import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: "STUDENT" | "COMPANY" | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "STUDENT" | "COMPANY" | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "STUDENT" | "COMPANY" | null;
  }
}