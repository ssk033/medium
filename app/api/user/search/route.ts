import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

/**
 * Search users for @ mention suggestions
 * Returns users in priority: followers/following first, then all users
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get followers and following IDs
    const [followers, following] = await Promise.all([
      prisma.follow.findMany({
        where: { followingId: userId },
        select: { followerId: true },
      }),
      prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      }),
    ]);

    const followerIds = followers.map((f) => f.followerId);
    const followingIds = following.map((f) => f.followingId);
    const priorityIds = [...new Set([...followerIds, ...followingIds])];

    // Build search condition
    const searchCondition = query
      ? {
          OR: [
            { username: { contains: query, mode: "insensitive" as const } },
            { name: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {};

    // Get priority users (followers + following)
    const priorityUsers = priorityIds.length > 0
      ? await prisma.user.findMany({
          where: {
            id: { in: priorityIds },
            ...searchCondition,
          },
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
          take: limit,
        })
      : [];

    // Get remaining users (excluding already fetched ones)
    const remainingLimit = limit - priorityUsers.length;
    const allUsers =
      remainingLimit > 0
        ? await prisma.user.findMany({
            where: {
              id: { notIn: [...priorityIds, userId] },
              ...searchCondition,
            },
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
            take: remainingLimit,
          })
        : [];

    // Combine and return
    const users = [...priorityUsers, ...allUsers];

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error("❌ GET /api/user/search Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

