import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Get blogs where a user is tagged
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get blogs where user is tagged
    const tags = await prisma.tag.findMany({
      where: { userId: user.id },
      include: {
        blog: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const blogs = tags.map((tag) => tag.blog);

    return NextResponse.json({ blogs, count: blogs.length }, { status: 200 });
  } catch (err) {
    console.error("❌ GET /api/user/tagged Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

