import { getServerSession } from "next-auth";
import { config as authOptions } from "./api/auth/[...nextauth]/route";
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
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative -mt-8 w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <div className="container py-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl animate-fade-up">
            Discover Your Next Favorite Entertainment
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl animate-fade-up animation-delay-100">
            Get personalized movie and TV show recommendations based on your taste. Start exploring now!
          </p>
        </div>
      </section>

      {/* Movies Section */}
      <section className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Recommended Movies
            </h2>
            <p className="mt-2 text-muted-foreground">
              Curated just for you based on your preferences
            </p>
          </div>
          <a
            href="/movies"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all movies →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {movies.map((movie) => (
            <MediaCard
              key={movie.id}
              media={movie as TMDBMovie}
              type="movie"
            />
          ))}
        </div>
      </section>

      {/* TV Shows Section */}
      <section className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Recommended TV Shows
            </h2>
            <p className="mt-2 text-muted-foreground">
              Top-rated series you might enjoy
            </p>
          </div>
          <a
            href="/tv"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all shows →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
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
