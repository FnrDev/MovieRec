import { Suspense } from "react";
import { tmdbService, TMDBMovie, TMDBTVShow } from "@/lib/tmdb";
import { MediaCard } from "@/components/MediaCard";

interface SearchPageProps {
  searchParams: { query?: string; page?: string };
}

async function SearchResults({ query, page = "1" }: { query: string; page?: string }) {
  const results = await tmdbService.searchMulti(query, parseInt(page));

  if (results.results.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">No results found</h2>
        <p className="text-muted-foreground mt-2">
          Try searching for something else
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {results.results.map((item: TMDBMovie | TMDBTVShow) => (
        <MediaCard
          key={item.id}
          media={item}
          type={"name" in item ? "tv" : "movie"}
        />
      ))}
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const { query, page } = searchParams;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        {query && (
          <p className="text-muted-foreground mt-2">
            Search results for &quot;{query}&quot;
          </p>
        )}
      </div>

      {query ? (
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          }
        >
          <SearchResults query={query} page={page} />
        </Suspense>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Start searching</h2>
          <p className="text-muted-foreground mt-2">
            Use the search bar above to find movies and TV shows
          </p>
        </div>
      )}
    </div>
  );
} 