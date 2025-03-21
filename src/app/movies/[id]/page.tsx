import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { StarIcon } from "@heroicons/react/20/solid";
import { tmdbService } from "@/lib/tmdb";
import { getImageUrl } from "@/lib/utils";

type MoviePageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function MovieContent({ id }: { id: string }) {
  try {
    const movie = await tmdbService.getMovieDetails(parseInt(id));

    return (
      <div className="space-y-8">
        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl">
          {movie.backdrop_path ? (
            <Image
              src={getImageUrl(movie.backdrop_path, "original")}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{movie.title}</h1>
            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              {movie.release_date && (
                <span>{new Date(movie.release_date).getFullYear()}</span>
              )}
              <span>•</span>
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                <span className="ml-1">
                  {movie.vote_average.toFixed(1)} ({movie.vote_count.toLocaleString()} reviews)
                </span>
              </div>
            </div>
          </div>

          <p className="text-lg leading-relaxed">{movie.overview}</p>

          {/* Additional movie details can be added here */}
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}

export default function MoviePage({ params }: MoviePageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <MovieContent id={params.id} />
    </Suspense>
  );
} 