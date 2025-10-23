import { getPopularMovies, getPopularShows, getMoviesByGenre } from '@/services/tmdb';
import { Skeleton } from '@/components/ui/skeleton';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { HomeClient } from './page-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'NushCeNume',
};

export default async function HomePage() {
  const language = cookies().get('crimson-language')?.value || 'en';

  const [
    movies,
    shows,
    actionMovies,
    comedyMovies,
    horrorMovies,
  ] = await Promise.all([
    getPopularMovies(language),
    getPopularShows(language),
    getMoviesByGenre('28', language),
    getMoviesByGenre('35', language),
    getMoviesByGenre('27', language),
  ]);

  const featured = movies[0];

  if (!featured) {
    return <Skeleton className="w-full h-screen" />;
  }

  return (
    <HomeClient
      featured={featured}
      movies={movies}
      shows={shows}
      actionMovies={actionMovies}
      comedyMovies={comedyMovies}
      horrorMovies={horrorMovies}
    />
  );
}