import { NextRequest, NextResponse } from "next/server";
import { tmdbService } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mediaType = (searchParams.get("mediaType") || "all") as "movie" | "tv" | "all";
    const timeWindow = (searchParams.get("timeWindow") || "week") as "day" | "week";

    const results = await tmdbService.getTrending(mediaType, timeWindow);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Trending error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending content" },
      { status: 500 }
    );
  }
} 