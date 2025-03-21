"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { WatchlistButton } from "./WatchlistButton";

interface TVShowActionsProps {
  tvShowId: string;
}

export function TVShowActions({ tvShowId }: TVShowActionsProps) {
  const { data: session } = useSession();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkWatchlistStatus() {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/watchlist/check?tvShowId=${tvShowId}`);
        const data = await response.json();
        setIsInWatchlist(data.isInWatchlist);
      } catch (error) {
        console.error("Error checking watchlist status:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkWatchlistStatus();
  }, [session, tvShowId]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <WatchlistButton tvShowId={tvShowId} isInWatchlist={isInWatchlist} />
    </div>
  );
} 