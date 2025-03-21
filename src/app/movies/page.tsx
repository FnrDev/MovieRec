import { Suspense } from "react";
import { tmdbService } from "@/lib/tmdb";
import { MediaCard } from "@/components/MediaCard";

async function MoviesContent() {
  const { results: movies } = await tmdbService.getTrending("movie");

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {movies.map((movie) => (
        <MediaCard key={movie.id} media={movie} type="movie" />
      ))}
    </div>
  );
}

export default function MoviesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Movies</h1>
        <p className="text-muted-foreground mt-2">
          Discover trending and popular movies
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }
      >
        <MoviesContent />
      </Suspense>
    </div>
  );
} 