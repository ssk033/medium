import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// ✅ CREATE BLOG (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, authorID } = body;

    if (!title?.trim() || !content?.trim() || !authorID) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, authorID" },
        { status: 400 }
      );
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        authorID,
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (err) {
    console.error("❌ POST /api/blog Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ GET ALL BLOGS (FETCH)
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        author: {
          select: { username: true, name: true, image: true },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (err) {
    console.error("❌ GET /api/blog Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ DELETE BLOG (DELETE)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");

    if (!blogId) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    // Check if blog exists and user is the author
    const blog = await prisma.blog.findUnique({
      where: { id: Number(blogId) },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    if (blog.authorID !== session.user.id) {
      return NextResponse.json({ error: "You can only delete your own blogs" }, { status: 403 });
    }

    // Delete the blog (cascade will handle related likes and comments)
    await prisma.blog.delete({
      where: { id: Number(blogId) },
    });

    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("❌ DELETE /api/blog Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
