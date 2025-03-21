"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface WatchlistButtonProps {
  tvShowId: string;
  isInWatchlist: boolean;
}

export function WatchlistButton({ tvShowId, isInWatchlist: initialIsInWatchlist }: WatchlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isInWatchlist, setIsInWatchlist] = useState(initialIsInWatchlist);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/watchlist", {
        method: isInWatchlist ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tvShowId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update watchlist");
      }

      setIsInWatchlist(!isInWatchlist);
      router.refresh();
    } catch (error) {
      console.error("Error updating watchlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 border shadow-sm ${
        isInWatchlist
          ? "bg-primary text-white hover:bg-primary/90 border-primary hover:border-primary/90"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/90 border-border hover:border-secondary"
      } hover:shadow-md hover:scale-[1.02]`}
    >
      {isInWatchlist ? (
        <BookmarkCheck className="h-5 w-5" />
      ) : (
        <Bookmark className="h-5 w-5" />
      )}
      <span>{isInWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
    </button>
  );
} 