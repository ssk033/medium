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

// Determine if we're in production based on NEXTAUTH_URL
const isProduction = process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;

export const authOptions: NextAuthOptions = {
  // ⭐ Cookie settings - use secure cookies for HTTPS (production)
  useSecureCookies: isProduction,

  // ⭐ Cookie configuration for authentication
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction, // true for HTTPS (production), false for localhost
      },
    },
    callbackUrl: {
      name: "next-auth.callback-url",
      options: { 
        sameSite: "lax", 
        path: "/", 
        secure: isProduction 
      },
    },
    csrfToken: {
      name: "next-auth.csrf-token",
      options: { 
        httpOnly: false, 
        sameSite: "lax", 
        path: "/", 
        secure: isProduction 
      },
    },
  },

  adapter: PrismaAdapter(prisma),

  // ⭐ database session required for PrismaAdapter
  session: {
    strategy: "database",
  },

  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),

    ...(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
      ? [
          LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            authorization: {
              params: {
                scope: "openid profile email",
              },
            },
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),

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
    async redirect({ url, baseUrl }) {
      // Allow relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/blogs`;
    },
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google" || account?.provider === "linkedin") {
          // Validate email exists
          if (!user.email) {
            console.error("❌ OAuth user missing email:", user);
            return false;
          }

          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
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
                email: user.email,
                username: genUsername(user.name ?? "user"),
                image: user.image ?? "",
                provider: provider,
              },
            });
          }

          user.id = dbUser.id;
          (user as { id: string; username?: string }).username = dbUser.username ?? undefined;
        }

        return true;
      } catch (error) {
        console.error("❌ signIn callback error:", error);
        return false;
      }
    },

    async session({ session, user }) {
      if (user) {
        session.user = {
          id: user.id,
          username: user.username ?? undefined,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
          image: user.image ?? undefined,
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

