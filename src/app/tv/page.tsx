import { Suspense } from "react";
import { tmdbService } from "@/lib/tmdb";
import { MediaCard } from "@/components/MediaCard";

async function TVShowsContent() {
  const { results: tvShows } = await tmdbService.getTrending("tv");

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {tvShows.map((show) => (
        <MediaCard key={show.id} media={show} type="tv" />
      ))}
    </div>
  );
}

export default function TVShowsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">TV Shows</h1>
        <p className="text-muted-foreground mt-2">
          Discover trending and popular TV shows
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }
      >
        <TVShowsContent />
      </Suspense>
    </div>
  );
} 