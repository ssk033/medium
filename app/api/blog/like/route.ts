import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

// ✅ CHECK IF USER LIKED (GET /api/blog/like?blogId=123)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ liked: false });
    }

    const liked = await prisma.like.findFirst({
      where: {
        blogId: Number(blogId),
        userId: session.user.id, // ✅ STRING id
      },
    });

    return NextResponse.json({ liked: !!liked }, { status: 200 });
  } catch (error) {
    console.error("❌ LIKE CHECK ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ TOGGLE LIKE (POST /api/blog/like)
export async function POST(req: Request) {
  try {
    const { blogId } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const exists = await prisma.like.findFirst({
      where: {
        blogId: Number(blogId),
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
        blogId: Number(blogId),
        userId: session.user.id,
      },
    });

    return NextResponse.json({ liked: true }, { status: 201 });
  } catch (error) {
    console.error("❌ LIKE TOGGLE ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
