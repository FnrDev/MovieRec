import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { MediaCard } from "@/components/MediaCard";
import { Watchlist } from "@prisma/client";

interface WatchlistWithMedia extends Watchlist {
  movie: {
    id: string;
    title: string;
    overview: string | null;
    posterPath: string | null;
    backdropPath: string | null;
    releaseDate: Date | null;
    voteAverage: number | null;
    voteCount: number | null;
    popularity: number | null;
  } | null;
  tvShow: {
    id: string;
    title: string;
    overview: string | null;
    posterPath: string | null;
    backdropPath: string | null;
    firstAirDate: Date | null;
    voteAverage: number | null;
    voteCount: number | null;
    popularity: number | null;
  } | null;
}

export default async function WatchlistPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const watchlist = await prisma.watchlist.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      movie: true,
      tvShow: true,
    },
    orderBy: {
      addedAt: "desc",
    },
  }) as WatchlistWithMedia[];

  if (watchlist.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Watchlist</h1>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Your watchlist is empty</h2>
          <p className="text-muted-foreground mt-2">
            Start adding movies and TV shows to your watchlist
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Your Watchlist</h1>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {watchlist.map((item: WatchlistWithMedia) => {
          if (item.movie) {
            return (
              <MediaCard
                key={item.id}
                media={{
                  id: parseInt(item.movie.id),
                  title: item.movie.title,
                  overview: item.movie.overview || "",
                  poster_path: item.movie.posterPath,
                  backdrop_path: item.movie.backdropPath,
                  release_date: item.movie.releaseDate?.toISOString() || "",
                  vote_average: item.movie.voteAverage || 0,
                  vote_count: item.movie.voteCount || 0,
                  popularity: item.movie.popularity || 0,
                  genre_ids: [],
                }}
                type="movie"
                isInWatchlist
              />
            );
          }

          if (item.tvShow) {
            return (
              <MediaCard
                key={item.id}
                media={{
                  id: parseInt(item.tvShow.id),
                  name: item.tvShow.title,
                  overview: item.tvShow.overview || "",
                  poster_path: item.tvShow.posterPath,
                  backdrop_path: item.tvShow.backdropPath,
                  first_air_date: item.tvShow.firstAirDate?.toISOString() || "",
                  vote_average: item.tvShow.voteAverage || 0,
                  vote_count: item.tvShow.voteCount || 0,
                  popularity: item.tvShow.popularity || 0,
                  genre_ids: [],
                }}
                type="tv"
                isInWatchlist
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
} 