import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

/**
 * Create a new comment on a blog post
 * Requires authentication and validates blog existence.
 * Trims comment content before saving.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { blogId, content } = await req.json();

    if (!blogId || !content?.trim()) {
      return NextResponse.json(
        { error: "Blog ID and content are required" },
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

    await prisma.comment.create({
      data: {
        text: content.trim(),
        blogId: blogIdNum,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: "Comment added" }, { status: 201 });
  } catch (err) {
    console.error("❌ POST /api/blog/comment Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * Get all comments for a specific blog post
 * Returns comments ordered by creation date (newest first).
 * Includes user information (username and name).
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

    const comments = await prisma.comment.findMany({
      where: { blogId },
      include: {
        user: { select: { username: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments }, { status: 200 });
  } catch (err) {
    console.error("❌ GET /api/blog/comment Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
