import axios from "axios";

const tmdbApi = axios.create({
  baseURL: process.env.TMDB_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
}

export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
}

export interface TMDBSearchResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export const tmdbService = {
  async searchMulti(query: string, page = 1) {
    const response = await tmdbApi.get<TMDBSearchResponse<TMDBMovie | TMDBTVShow>>(
      "/search/multi",
      {
        params: {
          query,
          page,
        },
      }
    );
    return response.data;
  },

  async getTrending(mediaType: "movie" | "tv" | "all", timeWindow: "day" | "week" = "week") {
    const response = await tmdbApi.get<TMDBSearchResponse<TMDBMovie | TMDBTVShow>>(
      `/trending/${mediaType}/${timeWindow}`
    );
    return response.data;
  },

  async getMovieDetails(movieId: number) {
    const response = await tmdbApi.get<TMDBMovie>(`/movie/${movieId}`);
    return response.data;
  },

  async getTVShowDetails(tvShowId: number) {
    const response = await tmdbApi.get<TMDBTVShow>(`/tv/${tvShowId}`);
    return response.data;
  },

  async getRecommendations(mediaType: "movie" | "tv", id: number, page = 1) {
    const response = await tmdbApi.get<TMDBSearchResponse<TMDBMovie | TMDBTVShow>>(
      `/${mediaType}/${id}/recommendations`,
      {
        params: {
          page,
        },
      }
    );
    return response.data;
  },

  async getGenres(mediaType: "movie" | "tv") {
    const response = await tmdbApi.get(`/genre/${mediaType}/list`);
    return response.data.genres;
  },
}; 