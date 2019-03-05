export interface tmdbFindMovieResponse {
  movie_results: Movieresult[];
  person_results: any[];
  tv_episode_results: any[];
  tv_results: any[];
  tv_season_results: any[];
}
export interface Movieresult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TmdbGenres {
  genres: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}
