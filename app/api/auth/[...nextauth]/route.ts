import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    // ✅ GOOGLE LOGIN WITH AUTO USERNAME + ACCOUNT LINKING
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,

      async profile(profile) {
        let user = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (user) {
          // ⭐ user exists but username null? → Assign username
          if (!user.username) {
            const newUsername =
              (profile.name || "user").replace(/\s+/g, "").toLowerCase() +
              Math.floor(1000 + Math.random() * 9000);

            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                username: newUsername,
                provider: "google",
              },
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username!,
            image: user.image,
          };
        }

        // ⭐ No existing user → create new one
        const randomUsername =
          (profile.name || "user").replace(/\s+/g, "").toLowerCase() +
          Math.floor(1000 + Math.random() * 9000);

        const newUser = await prisma.user.create({
          data: {
            name: profile.name,
            email: profile.email,
            username: randomUsername,
            image: profile.picture,
            provider: "google",
          },
        });

        return {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username!,
          image: newUser.image,
        };
      },
    }),

    // ✅ CREDENTIALS LOGIN
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<any> {
        if (!credentials?.username || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user || !user.password) return null;

        const validPass = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!validPass) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username!,
          image: user.image,
        };
      },
    }),
  ],

  // ✅ JWT + SESSION CALLBACKS
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // string
        token.username = (user as any).username;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: String(token.id),
        username: String(token.username),
        name: session.user?.name ?? "",
        email: session.user?.email ?? "",
        image: session.user?.image ?? "",
      };
      return session;
    },
  },

  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  secret: process.env.NEXTAUTH_SECRET!,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
