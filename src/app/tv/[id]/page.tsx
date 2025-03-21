import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { StarIcon } from "@heroicons/react/20/solid";
import { tmdbService } from "@/lib/tmdb";
import { getImageUrl } from "@/lib/utils";

interface TVShowPageProps {
  params: {
    id: string;
  };
}

async function TVShowContent({ id }: { id: string }) {
  try {
    const show = await tmdbService.getTVShowDetails(parseInt(id));

    return (
      <div className="space-y-8">
        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl">
          {show.backdrop_path ? (
            <Image
              src={getImageUrl(show.backdrop_path, "original")}
              alt={show.name}
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
            <h1 className="text-4xl font-bold tracking-tight">{show.name}</h1>
            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              {show.first_air_date && (
                <span>{new Date(show.first_air_date).getFullYear()}</span>
              )}
              <span>•</span>
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                <span className="ml-1">
                  {show.vote_average.toFixed(1)} ({show.vote_count.toLocaleString()} reviews)
                </span>
              </div>
            </div>
          </div>

          <p className="text-lg leading-relaxed">{show.overview}</p>

          {/* Additional show details can be added here */}
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

export default function TVShowPage({ params }: TVShowPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <TVShowContent id={params.id} />
    </Suspense>
  );
} 