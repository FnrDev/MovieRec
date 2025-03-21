import { prisma } from "@/lib/prisma";
import { tmdbService, TMDBMovie, TMDBTVShow } from "@/lib/tmdb";
import { Rating, Recommendations } from "@/types/tmdb";

interface TMDBResponse<T> {
  results: T[];
}

export class RecommendationService {
  static async getPersonalizedRecommendations(userId: string): Promise<Recommendations> {
    try {
      // Get user's ratings
      const userRatings = await prisma.rating.findMany({
        where: { userId },
        include: {
          movie: true,
          tvShow: true,
        },
      }) as Rating[];

      // Get genres the user likes based on high ratings (4-5 stars)
      const highlyRatedGenres = new Set<number>();
      const highlyRatedContent = userRatings.filter((rating) => rating.rating >= 4);

      for (const rating of highlyRatedContent) {
        if (rating.movie) {
          const movieDetails = await tmdbService.getMovieDetails(rating.movie.tmdbId);
          movieDetails.genre_ids?.forEach((genreId: number) => highlyRatedGenres.add(genreId));
        } else if (rating.tvShow) {
          const tvShowDetails = await tmdbService.getTVShowDetails(rating.tvShow.tmdbId);
          tvShowDetails.genre_ids?.forEach((genreId: number) => highlyRatedGenres.add(genreId));
        }
      }

      // Get recommendations based on user preferences and highly rated content
      const recommendations: Recommendations = {
        movies: [],
        tvShows: [],
      };

      // Get recommendations for movies
      if (highlyRatedContent.some((rating) => rating.movie)) {
        const movieRecs = await Promise.all(
          highlyRatedContent
            .filter((rating) => rating.movie)
            .slice(0, 3)
            .map((rating) => tmdbService.getRecommendations("movie", rating.movie!.tmdbId))
        );

        recommendations.movies = movieRecs
          .flatMap((rec: TMDBResponse<TMDBMovie>) => rec.results)
          .filter((movie: TMDBMovie) => 
            movie.genre_ids.some((id: number) => highlyRatedGenres.has(id))
          )
          .slice(0, 10);
      }

      // Get recommendations for TV shows
      if (highlyRatedContent.some((rating) => rating.tvShow)) {
        const tvRecs = await Promise.all(
          highlyRatedContent
            .filter((rating) => rating.tvShow)
            .slice(0, 3)
            .map((rating) => tmdbService.getRecommendations("tv", rating.tvShow!.tmdbId))
        );

        recommendations.tvShows = tvRecs
          .flatMap((rec: TMDBResponse<TMDBTVShow>) => rec.results)
          .filter((show: TMDBTVShow) => 
            show.genre_ids.some((id: number) => highlyRatedGenres.has(id))
          )
          .slice(0, 10);
      }

      // If user has no ratings, return trending content
      if (recommendations.movies.length === 0 && recommendations.tvShows.length === 0) {
        const [trendingMovies, trendingTVShows] = await Promise.all([
          tmdbService.getTrending("movie"),
          tmdbService.getTrending("tv"),
        ]);

        recommendations.movies = trendingMovies.results.slice(0, 10);
        recommendations.tvShows = trendingTVShows.results.slice(0, 10);
      }

      return recommendations;
    } catch (error) {
      console.error("Error getting personalized recommendations:", error);
      throw error;
    }
  }

  static async getTrendingRecommendations(): Promise<Recommendations> {
    try {
      const [movies, tvShows] = await Promise.all([
        tmdbService.getTrending("movie"),
        tmdbService.getTrending("tv"),
      ]);

      return {
        movies: movies.results.slice(0, 10),
        tvShows: tvShows.results.slice(0, 10),
      };
    } catch (error) {
      console.error("Error getting trending recommendations:", error);
      throw error;
    }
  }
} 