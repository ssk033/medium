import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Handle pgbouncer parameter properly
const getDatabaseUrl = () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  // Only add pgbouncer if not already present and in production
  if (process.env.NODE_ENV === "production" && !dbUrl.includes("pgbouncer")) {
    const separator = dbUrl.includes("?") ? "&" : "?";
    return `${dbUrl}${separator}pgbouncer=true`;
  }
  return dbUrl;
};

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
