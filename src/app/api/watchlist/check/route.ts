import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { config as authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ isInWatchlist: false }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tvShowId = searchParams.get("tvShowId");

  if (!tvShowId) {
    return NextResponse.json(
      { error: "TV show ID is required" },
      { status: 400 }
    );
  }

  try {
    const watchlistItem = await prisma.watchlist.findFirst({
      where: {
        userId: session.user.id,
        tvShowId: tvShowId,
      },
    });

    return NextResponse.json({ isInWatchlist: !!watchlistItem });
  } catch (error) {
    console.error("Error checking watchlist status:", error);
    return NextResponse.json(
      { error: "Failed to check watchlist status" },
      { status: 500 }
    );
  }
} 