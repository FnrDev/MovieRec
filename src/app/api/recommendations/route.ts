import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { config } from "@/app/api/auth/[...nextauth]/route";
import { RecommendationService } from "@/services/recommendations";

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(config);

    if (!session?.user?.id) {
      // Return trending recommendations for non-authenticated users
      const recommendations = await RecommendationService.getTrendingRecommendations();
      return NextResponse.json(recommendations);
    }

    // Get personalized recommendations for authenticated users
    const recommendations = await RecommendationService.getPersonalizedRecommendations(
      session.user.id
    );

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Recommendations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; 