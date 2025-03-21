import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Rating, Watchlist, Movie, TVShow, User } from "@prisma/client";
import { authOptions } from "../api/auth/[...nextauth]/route";

interface MovieWithTitle extends Movie {
  title: string;
}

interface TVShowWithName extends TVShow {
  name: string;
}

interface RatingWithMedia extends Rating {
  movie: MovieWithTitle | null;
  tvShow: TVShowWithName | null;
  createdAt: Date;
}

interface WatchlistWithMedia extends Watchlist {
  movie: MovieWithTitle | null;
  tvShow: TVShowWithName | null;
  addedAt: Date;
}

interface UserWithActivity extends User {
  ratings: RatingWithMedia[];
  watchlist: WatchlistWithMedia[];
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Fetch user data including their ratings and watchlist
  const userData = await prisma.user.findUnique({
    where: {
      email: session.user.email!,
    },
    include: {
      ratings: {
        include: {
          movie: true,
          tvShow: true,
        },
        orderBy: [
          { createdAt: 'desc' }
        ],
        take: 5
      },
      watchlist: {
        include: {
          movie: true,
          tvShow: true,
        },
        orderBy: [
          { addedAt: 'desc' }
        ],
        take: 5
      }
    }
  }) as UserWithActivity | null;

  if (!userData) {
    redirect("/auth/signin");
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8">
        {/* Profile Header */}
        <div className="flex items-center space-x-4">
          {userData.image ? (
            <img
              src={userData.image}
              alt={userData.name || ""}
              className="h-20 w-20 rounded-full"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-500">
                {userData.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <p className="text-gray-500">{userData.email}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6">
          {/* Recent Ratings */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Ratings</h2>
            {userData.ratings.length > 0 ? (
              <div className="grid gap-4">
                {userData.ratings.map((rating: RatingWithMedia) => (
                  <div
                    key={rating.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <h3 className="font-medium">
                        {rating.movie?.title || rating.tvShow?.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-lg font-semibold">
                      {rating.rating}/10
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No ratings yet</p>
            )}
          </section>

          {/* Watchlist */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Watchlist</h2>
            {userData.watchlist.length > 0 ? (
              <div className="grid gap-4">
                {userData.watchlist.map((item: WatchlistWithMedia) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <h3 className="font-medium">
                        {item.movie?.title || item.tvShow?.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Added on {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Your watchlist is empty</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
} 