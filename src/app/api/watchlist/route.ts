import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const watchlist = await prisma.watchlist.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        movie: true,
        tvShow: true,
      },
      orderBy: {
        addedAt: "desc",
      },
    });

    return NextResponse.json(watchlist);
  } catch (error) {
    console.error("Watchlist fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { tvShowId } = await request.json();

    if (!tvShowId) {
      return NextResponse.json(
        { error: "TV show ID is required" },
        { status: 400 }
      );
    }

    const tvShow = await prisma.tVShow.findUnique({
      where: { id: tvShowId },
    });

    if (!tvShow) {
      return NextResponse.json(
        { error: "TV show not found" },
        { status: 404 }
      );
    }

    const watchlistItem = await prisma.watchlist.create({
      data: {
        userId: session.user.id,
        tvShowId,
      },
    });

    return NextResponse.json(watchlistItem);
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return NextResponse.json(
      { error: "Failed to add to watchlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { tvShowId } = await request.json();

    if (!tvShowId) {
      return NextResponse.json(
        { error: "TV show ID is required" },
        { status: 400 }
      );
    }

    await prisma.watchlist.deleteMany({
      where: {
        userId: session.user.id,
        tvShowId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return NextResponse.json(
      { error: "Failed to remove from watchlist" },
      { status: 500 }
    );
  }
} 