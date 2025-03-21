# Movie & TV Show Recommendation Platform

A modern web application that helps users discover movies and TV shows based on their preferences and viewing history.

## Features

- **User Authentication**: Secure sign-up and login functionality
- **Search & Filtering**: Search for movies and TV shows by title, genre, release year, or rating
- **Personalized Recommendations**: Get content recommendations based on your preferences and watch history
- **Watchlist**: Save movies and shows to watch later
- **Rating System**: Rate movies and TV shows with a 5-star system
- **Trending Content**: Discover what's popular right now

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **External API**: TMDB (The Movie Database)
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- TMDB API key

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/movie_recommendation?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# TMDB API
TMDB_API_KEY="your-tmdb-api-key"
TMDB_API_BASE_URL="https://api.themoviedb.org/3"
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup`: Create a new user account
- `POST /api/auth/signin`: Sign in to an existing account

### Search
- `GET /api/search?query={query}&page={page}`: Search for movies and TV shows

### Recommendations
- `GET /api/recommendations`: Get personalized recommendations (requires authentication)
- `GET /api/trending`: Get trending movies and TV shows

### Watchlist
- `GET /api/watchlist`: Get user's watchlist
- `POST /api/watchlist`: Add item to watchlist
- `DELETE /api/watchlist?id={id}`: Remove item from watchlist

### Ratings
- `GET /api/ratings`: Get user's ratings
- `POST /api/ratings`: Rate a movie or TV show
- `DELETE /api/ratings?id={id}`: Remove a rating

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
