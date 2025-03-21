import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { RecommendationService } from "@/services/recommendations";
import { MediaCard } from "@/components/MediaCard";
import { TMDBMovie, TMDBTVShow } from "@/lib/tmdb";

async function getRecommendations() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    return RecommendationService.getPersonalizedRecommendations(session.user.id);
  }

  return RecommendationService.getTrendingRecommendations();
}

export default async function Home() {
  const { movies, tvShows } = await getRecommendations();

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Recommended Movies
          </h2>
          <a
            href="/movies"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </a>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {movies.map((movie) => (
            <MediaCard
              key={movie.id}
              media={movie as TMDBMovie}
              type="movie"
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Recommended TV Shows
          </h2>
          <a
            href="/tv"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </a>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {tvShows.map((show) => (
            <MediaCard
              key={show.id}
              media={show as TMDBTVShow}
              type="tv"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
