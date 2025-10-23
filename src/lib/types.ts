export type Media = {
  id: number;
  title: string;
  type: 'movie' | 'show';
  description: string;
  genres: { id: number; name: string }[];
  year: number;
  popularity?: number;
  rating?: number;
  cast: { name: string; character: string; profile_path: string | null }[];
  reviews: { user: string; comment: string; rating: number }[];
  imageUrl: string;
  posterUrl: string;
  'data-ai-hint': string;
  seasons?: TmdbSeason[];
};

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
}

export interface TmdbShow {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  genre_ids: number[];
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
}

export interface TmdbMovieDetails extends TmdbMovie {
  genres: { id: number; name: string }[];
  credits: {
    cast: { name: string; character: string; profile_path: string | null }[];
  };
}

export interface TmdbShowDetails extends TmdbShow {
  genres: { id: number; name: string }[];
  credits: {
    cast: { name: string; character: string; profile_path: string | null }[];
  };
  seasons: TmdbSeason[];
}

export interface TmdbSeason {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface Episode {
  air_date: string;
  crew: any[];
  episode_number: number;
  guest_stars: any[];
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}