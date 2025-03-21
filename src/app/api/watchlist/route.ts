import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { mediaType, mediaId } = body;

    if (!mediaType || !mediaId) {
      return NextResponse.json(
        { error: "Media type and ID are required" },
        { status: 400 }
      );
    }

    const watchlistItem = await prisma.watchlist.create({
      data: {
        userId: session.user.id,
        ...(mediaType === "movie"
          ? { movieId: mediaId }
          : { tvShowId: mediaId }),
      },
    });

    return NextResponse.json(watchlistItem);
  } catch (error) {
    console.error("Watchlist add error:", error);
    return NextResponse.json(
      { error: "Failed to add to watchlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const watchlistId = searchParams.get("id");

    if (!watchlistId) {
      return NextResponse.json(
        { error: "Watchlist ID is required" },
        { status: 400 }
      );
    }

    await prisma.watchlist.delete({
      where: {
        id: watchlistId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Watchlist delete error:", error);
    return NextResponse.json(
      { error: "Failed to remove from watchlist" },
      { status: 500 }
    );
  }
} 