import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TVShowActions } from "@/components/TVShowActions";

type TVShowPageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function TVShowPage({ params }: TVShowPageProps) {
  const tvShow = await prisma.tVShow.findUnique({
    where: { id: params.id },
    include: {
      genres: true,
    },
  });

  if (!tvShow) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          {tvShow.posterPath && (
            <img
              src={`https://image.tmdb.org/t/p/w500${tvShow.posterPath}`}
              alt={tvShow.title}
              className="w-full rounded-lg shadow-lg"
            />
          )}
        </div>
        <div className="w-full md:w-2/3">
          <h1 className="text-4xl font-bold mb-4">{tvShow.title}</h1>
          <div className="flex items-center gap-4 mb-4">
            <TVShowActions tvShowId={tvShow.id} />
          </div>
          <p className="text-foreground mb-4">{tvShow.overview}</p>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Details</h2>
            <p><strong>First Air Date:</strong> {tvShow.firstAirDate?.toLocaleDateString()}</p>
            <p><strong>Rating:</strong> {tvShow.voteAverage ? `${tvShow.voteAverage.toFixed(1)}/10` : 'Not rated'} ({tvShow.voteCount || 0} votes)</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Genres</h2>
            <div className="flex flex-wrap gap-2">
              {tvShow.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 