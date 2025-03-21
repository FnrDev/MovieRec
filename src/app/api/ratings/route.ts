import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const mediaType = searchParams.get("mediaType");
    const mediaId = searchParams.get("mediaId");

    const where = {
      userId: session.user.id,
      ...(mediaType && mediaId
        ? mediaType === "movie"
          ? { movieId: mediaId }
          : { tvShowId: mediaId }
        : {}),
    };

    const ratings = await prisma.rating.findMany({
      where,
      include: {
        movie: true,
        tvShow: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(ratings);
  } catch (error) {
    console.error("Ratings fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
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
    const { mediaType, mediaId, rating } = body;

    if (!mediaType || !mediaId || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Invalid rating data" },
        { status: 400 }
      );
    }

    const ratingData = {
      userId: session.user.id,
      rating,
      ...(mediaType === "movie"
        ? { movieId: mediaId }
        : { tvShowId: mediaId }),
    };

    const existingRating = await prisma.rating.findFirst({
      where: {
        userId: session.user.id,
        ...(mediaType === "movie"
          ? { movieId: mediaId }
          : { tvShowId: mediaId }),
      },
    });

    const userRating = existingRating
      ? await prisma.rating.update({
          where: { id: existingRating.id },
          data: { rating },
        })
      : await prisma.rating.create({
          data: ratingData,
        });

    return NextResponse.json(userRating);
  } catch (error) {
    console.error("Rating add/update error:", error);
    return NextResponse.json(
      { error: "Failed to save rating" },
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
    const ratingId = searchParams.get("id");

    if (!ratingId) {
      return NextResponse.json(
        { error: "Rating ID is required" },
        { status: 400 }
      );
    }

    await prisma.rating.delete({
      where: {
        id: ratingId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Rating delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete rating" },
      { status: 500 }
    );
  }
} 