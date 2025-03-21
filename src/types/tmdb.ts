import { TMDBMovie, TMDBTVShow } from "@/lib/tmdb";

export interface Rating {
  id: string;
  userId: string;
  movieId?: string;
  tvShowId?: string;
  rating: number;
  movie?: {
    id: string;
    tmdbId: number;
  };
  tvShow?: {
    id: string;
    tmdbId: number;
  };
}

export interface UserPreference {
  id: string;
  userId: string;
  genreId: number;
  weight: number;
}

export interface Recommendations {
  movies: TMDBMovie[];
  tvShows: TMDBTVShow[];
} 