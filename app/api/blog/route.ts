import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";

/**
 * Create a new blog post
 * Supports both multipart/form-data (with file uploads) and JSON formats.
 * Converts uploaded files to base64 data URLs for storage.
 */
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type");
    
    let title: string;
    let content: string;
    let authorID: string;
    let files: File[] = [];

    if (contentType?.includes("multipart/form-data")) {
      // Handle FormData (with file uploads)
      const formData = await req.formData();
      title = formData.get("title") as string;
      content = formData.get("content") as string;
      authorID = formData.get("authorID") as string;
      
      // Extract files
      const fileEntries = formData.getAll("files");
      files = fileEntries.filter((file): file is File => file instanceof File);
    } else {
      // Handle JSON (backward compatibility)
      const body = await req.json();
      title = body.title;
      content = body.content;
      authorID = body.authorID;
    }

    if (!title?.trim() || !content?.trim() || !authorID) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, authorID" },
        { status: 400 }
      );
    }

    // Convert files to base64 data URLs for storage
    const mediaUrls: string[] = [];
    if (files.length > 0) {
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");
        const dataUrl = `data:${file.type};base64,${base64}`;
        mediaUrls.push(dataUrl);
      }
      console.log(`📎 Processed ${files.length} file(s) for blog`);
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        authorID,
        mediaUrls,
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (err) {
    console.error("❌ POST /api/blog Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * Retrieve all blog posts
 * Returns blogs with author information and like/comment counts.
 * Ordered by creation date (newest first).
 */
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        author: {
          select: { id: true, username: true, name: true, image: true },
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

/**
 * Delete a blog post
 * Only the blog author can delete their own posts.
 * Cascades deletion of associated likes and comments.
 */
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

    const blogIdNum = Number(blogId);
    if (isNaN(blogIdNum)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    // Check if blog exists and user is the author
    const blog = await prisma.blog.findUnique({
      where: { id: blogIdNum },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    if (blog.authorID !== session.user.id) {
      return NextResponse.json({ error: "You can only delete your own blogs" }, { status: 403 });
    }

    // Delete related records first (likes and comments)
    // This is necessary because schema doesn't have cascade delete
    await prisma.like.deleteMany({
      where: { blogId: blogIdNum },
    });

    await prisma.comment.deleteMany({
      where: { blogId: blogIdNum },
    });

    // Now delete the blog
    await prisma.blog.delete({
      where: { id: blogIdNum },
    });

    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("❌ DELETE /api/blog Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
