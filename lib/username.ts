// lib/username.ts
import prisma from "@/lib/prisma";

function slugify(x: string) {
  return x
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 20);
}

function randomChunk(len = 6) {
  return Math.random().toString(36).slice(2, 2 + len);
}

/**
 * Ensure a user has a unique username. Returns updated user.
 */
export async function ensureUsername(opts: { userId: string; name?: string; email?: string }) {
  const { userId, name = "", email = "" } = opts;

  // Build base candidates
  const fromName = slugify(name);
  const fromEmail = slugify(email.split("@")[0] ?? "");
  const fallbacks = ["user", "writer", "zingg"];

  const candidates = [
    fromName,
    fromEmail,
    ...fallbacks,
  ].filter(Boolean);

  // Try base, then add suffix until unique
  let final: string | null = null;

  for (const base of candidates) {
    // Try base itself
    if (base) {
      const exists = await prisma.user.findUnique({ where: { username: base } });
      if (!exists) {
        final = base;
        break;
      }
    }
    // Try a few suffixed options
    for (let i = 0; i < 5; i++) {
      const trial = `${base || "user"}_${randomChunk(5)}`;
      const exists = await prisma.user.findUnique({ where: { username: trial } });
      if (!exists) {
        final = trial;
        break;
      }
    }
    if (final) break;
  }

  // If still nothing, pure random
  if (!final) final = `user_${randomChunk(8)}`;

  return prisma.user.update({
    where: { id: userId },
    data: { username: final },
  });
}
