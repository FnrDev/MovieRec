"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/Button";
import { Bookmark } from "lucide-react";

interface WatchlistButtonProps {
  tvShowId: string;
  isInWatchlist?: boolean;
}

export function WatchlistButton({ tvShowId, isInWatchlist = false }: WatchlistButtonProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isInList, setIsInList] = useState(isInWatchlist);

  const handleWatchlistClick = async () => {
    if (!session) {
      // Redirect to sign in if not authenticated
      window.location.href = "/auth/signin";
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/watchlist", {
        method: isInList ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tvShowId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update watchlist");
      }

      setIsInList(!isInList);
    } catch (error) {
      console.error("Error updating watchlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isInList ? "default" : "outline"}
      size="sm"
      onClick={handleWatchlistClick}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <Bookmark
        className={`h-4 w-4 ${isInList ? "fill-current" : ""}`}
      />
      {isInList ? "Remove from Watchlist" : "Add to Watchlist"}
    </Button>
  );
} 