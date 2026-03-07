import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!valid) return null;

        return {
          id: user.id,
          email: user.email!,
          name: user.name,
          role: user.role ?? null,
        };
      },
    }),
  ],

  callbacks: {
   async jwt({ token, user }) {
  // First login
  if (user) {
    token.role = user.role ?? null;
  }

  // Always sync role from DB
  if (token.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: token.email },
    });

    token.role = dbUser?.role ?? null;
  }

  return token;
},

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as
          | "STUDENT"
          | "COMPANY"
          | null;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };