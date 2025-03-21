import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/20/solid";
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import { formatDate, getImageUrl, truncateText } from "@/lib/utils";
import { TMDBMovie, TMDBTVShow } from "@/lib/tmdb";
import { Button } from "./ui/Button";

interface MediaCardProps {
  media: TMDBMovie | TMDBTVShow;
  type: "movie" | "tv";
  isInWatchlist?: boolean;
  onAddToWatchlist?: () => void;
  onRemoveFromWatchlist?: () => void;
}

export function MediaCard({
  media,
  type,
  isInWatchlist = false,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}: MediaCardProps) {
  const title = type === "movie" ? (media as TMDBMovie).title : (media as TMDBTVShow).name;
  const releaseDate = type === "movie"
    ? (media as TMDBMovie).release_date
    : (media as TMDBTVShow).first_air_date;
  const imageUrl = media.poster_path ? getImageUrl(media.poster_path) : null;
  const href = type === "movie" ? `/movies/${media.id}` : `/tv/${media.id}`;
  const rating = typeof media.vote_average === 'number' ? media.vote_average.toFixed(1) : 'N/A';

  return (
    <div className="group relative overflow-hidden rounded-lg bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={href} className="block">
        <div className="aspect-[2/3] relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-all duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>

      <div className="absolute bottom-0 left-0 right-0 p-4 transform transition-transform duration-300">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-white line-clamp-1 text-lg group-hover:text-primary transition-colors">
              {title}
            </h3>
            {releaseDate && (
              <p className="text-sm text-gray-300 mt-1">{new Date(releaseDate).getFullYear()}</p>
            )}
          </div>
          <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">
              {rating}
            </span>
          </div>
        </div>

        <p className="mt-3 text-sm text-white line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
          {truncateText(media.overview || 'No description available', 150)}
        </p>

        {(onAddToWatchlist || onRemoveFromWatchlist) && (
          <div className="mt-4 flex items-center gap-2 transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              size="sm"
              variant={isInWatchlist ? "outline" : "default"}
              className="w-full shadow-lg hover:shadow-xl transition-shadow"
              onClick={isInWatchlist ? onRemoveFromWatchlist : onAddToWatchlist}
            >
              {isInWatchlist ? (
                <BookmarkSolid className="h-4 w-4 mr-2" />
              ) : (
                <BookmarkOutline className="h-4 w-4 mr-2" />
              )}
              {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 