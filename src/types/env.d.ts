declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    TMDB_API_KEY: string;
    TMDB_API_BASE_URL: string;
  }
} 