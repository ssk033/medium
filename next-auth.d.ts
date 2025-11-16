import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;        // String ID to match Prisma schema (cuid format)
    username: string;
  }

  interface Session {
    user: {
      id: string;      // String ID for consistency with User model
      username: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;        // JWT token stores user ID as string
    username: string;
  }
}
