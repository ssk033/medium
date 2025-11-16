import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

/**
 * Check if the current user has liked a specific blog post
 * Returns false if user is not authenticated.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const blogIdParam = searchParams.get("blogId");

    if (!blogIdParam) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    const blogId = Number(blogIdParam);
    if (isNaN(blogId)) {
      return NextResponse.json(
        { error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ liked: false }, { status: 200 });
    }

    const liked = await prisma.like.findFirst({
      where: {
        blogId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ liked: !!liked }, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/blog/like Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * Toggle like status for a blog post
 * Creates a like if it doesn't exist, removes it if it does.
 * Requires authentication and verifies blog existence.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { blogId } = await req.json();

    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    const blogIdNum = Number(blogId);
    if (isNaN(blogIdNum)) {
      return NextResponse.json(
        { error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    // Verify blog exists
    const blog = await prisma.blog.findUnique({
      where: { id: blogIdNum },
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    const exists = await prisma.like.findFirst({
      where: {
        blogId: blogIdNum,
        userId: session.user.id,
      },
    });

    if (exists) {
      await prisma.like.delete({
        where: { id: exists.id },
      });

      return NextResponse.json({ liked: false }, { status: 200 });
    }

    await prisma.like.create({
      data: {
        blogId: blogIdNum,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ liked: true }, { status: 201 });
  } catch (error) {
    console.error("❌ POST /api/blog/like Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
