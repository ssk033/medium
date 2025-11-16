import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

/**
 * Update user profile picture
 * Accepts image file and converts to base64 data URL for storage.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Convert to base64 data URL
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Update user profile picture
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: dataUrl },
      select: {
        id: true,
        image: true,
      },
    });

    return NextResponse.json(
      { image: updatedUser.image, message: "Profile picture updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ POST /api/user/avatar Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * Remove user profile picture
 * Sets the user's image field to null.
 */
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Remove profile picture by setting image to null
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: null },
      select: {
        id: true,
        image: true,
      },
    });

    return NextResponse.json(
      { image: null, message: "Profile picture removed successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ DELETE /api/user/avatar Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

