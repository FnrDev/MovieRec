import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { StarIcon } from "@heroicons/react/20/solid";
import { getServerSession } from "next-auth";
import { tmdbService } from "@/lib/tmdb";
import { getImageUrl } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { WatchlistButton } from "@/components/WatchlistButton";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface TVShowPageProps {
  params: {
    id: string;
  };
}

async function TVShowContent({ id }: { id: string }) {
  try {
    const [show, session] = await Promise.all([
      tmdbService.getTVShowDetails(parseInt(id)),
      getServerSession(authOptions)
    ]);

    // Check if the show is in the user's watchlist
    let isInWatchlist = false;
    if (session?.user?.id) {
      const watchlistItem = await prisma.watchlist.findFirst({
        where: {
          userId: session.user.id,
          tvShowId: id,
        },
      });
      isInWatchlist = !!watchlistItem;
    }

    // First save the show in our database if it doesn't exist
    const dbShow = await prisma.tVShow.upsert({
      where: { tmdbId: show.id },
      update: {},
      create: {
        id: show.id.toString(),
        tmdbId: show.id,
        title: show.name,
        overview: show.overview,
        posterPath: show.poster_path,
        backdropPath: show.backdrop_path,
        firstAirDate: show.first_air_date ? new Date(show.first_air_date) : null,
        voteAverage: show.vote_average,
        voteCount: show.vote_count,
        popularity: show.popularity,
      },
    });

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
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold tracking-tight">{show.name}</h1>
              <WatchlistButton tvShowId={dbShow.id} isInWatchlist={isInWatchlist} />
            </div>
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
    console.error("Error loading TV show:", error);
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