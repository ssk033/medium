// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

// Validate required environment variables at runtime
if (!process.env.NEXTAUTH_SECRET) {
  console.error("❌ NEXTAUTH_SECRET is not set. Please set it in your environment variables.");
}

if (!process.env.NEXTAUTH_URL) {
  console.warn("⚠️ NEXTAUTH_URL is not set. This may cause issues in production.");
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
