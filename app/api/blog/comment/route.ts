import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { blogId, content } = await req.json();

    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.comment.create({
      data: {
        text: content,
        blogId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: "Comment added" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const blogId = Number(searchParams.get("blogId"));

    const comments = await prisma.comment.findMany({
      where: { blogId },
      include: {
        user: { select: { username: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
