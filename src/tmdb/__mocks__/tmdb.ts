import { TmdbGenres, Genre, Movieresult, tmdbFindMovieResponse } from '../tmdbModels'
import tmdbGenreResponse from './tmdbGenreResponse.json'
import tmdbMovieResponse from './tmdbMovieResponse.json'

export async function getMovieInfo(imdbID: String): Promise<Movieresult> {
  try {
    const tmdbResponse: tmdbFindMovieResponse = await Promise.resolve(tmdbMovieResponse)
    const tmdbMovieDetails: Movieresult = tmdbResponse.movie_results[0]
    return tmdbMovieDetails
  } catch (error) {
    throw new Error(error.message)
  }
}

export async function getGenres(): Promise<Genre[]> {
  try {
    const TmdbRespBody: TmdbGenres = await Promise.resolve(tmdbGenreResponse)
    return TmdbRespBody.genres
  } catch (error) {
    throw new Error(error.message)
  }
}

export async function getGenreNamesfromGenreIds(genre_ids: number[]): Promise<string[]> {
  const genreNames: string[] = []
  try {
    const tmdbGenres: Genre[] = await getGenres()
    for (const genreId of genre_ids) {
      for (const tmdbGenre of tmdbGenres) {
        if (genreId === tmdbGenre.id) {
          genreNames.push(tmdbGenre.name)
        }
      }
    }
    return genreNames
  } catch (error) {
    throw new Error(error.message)
  }
}
