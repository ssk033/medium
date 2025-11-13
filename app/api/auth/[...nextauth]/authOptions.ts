// app/api/auth/[...nextauth]/authOptions.ts
import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const genUsername = (name: string) =>
  name.replace(/\s+/g, "").toLowerCase() +
  Math.floor(1000 + Math.random() * 9000);

export const authOptions: NextAuthOptions = {
  // ⭐ Important for localhost on Linux
  useSecureCookies: false,

  // ⭐ Forces Chrome/Linux/Fedora to accept cookies
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false, // MUST be false for localhost
      },
    },
    callbackUrl: {
      name: "next-auth.callback-url",
      options: { sameSite: "lax", path: "/", secure: false },
    },
    csrfToken: {
      name: "next-auth.csrf-token",
      options: { httpOnly: false, sameSite: "lax", path: "/", secure: false },
    },
  },

  adapter: PrismaAdapter(prisma),

  // ⭐ database session required for PrismaAdapter
  session: {
    strategy: "database",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(
        credentials: Record<"username" | "password", string> | undefined
      ): Promise<{ id: string; name: string; email: string; image: string; username: string } | null> {
        if (!credentials?.username || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user || !user.password) return null;

        const match = await bcrypt.compare(credentials.password, user.password);
        if (!match) return null;

        return {
          id: user.id,
          name: user.name ?? "",
          email: user.email ?? "",
          image: user.image ?? "",
          username: user.username ?? "",
        };
      },
    }),
  ],

  callbacks: {
     redirect() {
    return "/blogs";
  },
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "linkedin") {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        const provider = account.provider;

        // Link username + provider
        if (dbUser && dbUser.provider !== provider) {
          dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: { provider: provider },
          });
        }

        // New OAuth user
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              name: user.name ?? "",
              email: user.email!,
              username: genUsername(user.name ?? "user"),
              image: user.image ?? "",
              provider: provider,
            },
          });
        }

        user.id = dbUser.id;
        (user as { id: string; username?: string }).username = dbUser.username;
      }

      return true;
    },

    async session({ session, user }: { session: { user?: { id?: string; username?: string; name?: string; email?: string; image?: string } }; user?: { id: string; username?: string; name?: string; email?: string; image?: string } }) {
      if (user) {
        session.user = {
          id: user.id,
          username: user.username ?? "",
          name: user.name ?? "",
          email: user.email ?? "",
          image: user.image ?? "",
        };
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },

  secret: process.env.NEXTAUTH_SECRET!,
};

