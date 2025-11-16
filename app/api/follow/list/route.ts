import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

/**
 * Get list of followers or following users
 * Returns a list of users with their follow status relative to the current user.
 * @param userId - The user ID to get followers/following for
 * @param type - Either "followers" or "following"
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type"); // "followers" or "following"

    if (!userId || !type) {
      return NextResponse.json(
        { error: "User ID and type are required" },
        { status: 400 }
      );
    }

    if (type !== "followers" && type !== "following") {
      return NextResponse.json(
        { error: "Type must be 'followers' or 'following'" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    let users: Array<{
      id: string;
      name: string | null;
      username: string | null;
      image: string | null;
      followed: boolean;
    }> = [];

    if (type === "followers") {
      // Get users who follow this user
      const follows = await prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Check which of these users the current user follows
      const followerIds = follows.map((f) => f.follower.id);
      const currentUserFollows = await prisma.follow.findMany({
        where: {
          followerId: session.user.id,
          followingId: { in: followerIds },
        },
      });

      const followedSet = new Set(currentUserFollows.map((f) => f.followingId));

      users = follows.map((f) => ({
        id: f.follower.id,
        name: f.follower.name,
        username: f.follower.username,
        image: f.follower.image,
        followed: followedSet.has(f.follower.id),
      }));
    } else {
      // Get users this user follows
      const follows = await prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Check which of these users the current user follows
      const followingIds = follows.map((f) => f.following.id);
      const currentUserFollows = await prisma.follow.findMany({
        where: {
          followerId: session.user.id,
          followingId: { in: followingIds },
        },
      });

      const followedSet = new Set(currentUserFollows.map((f) => f.followingId));

      users = follows.map((f) => ({
        id: f.following.id,
        name: f.following.name,
        username: f.following.username,
        image: f.following.image,
        followed: followedSet.has(f.following.id),
      }));
    }

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error("❌ GET /api/follow/list Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

