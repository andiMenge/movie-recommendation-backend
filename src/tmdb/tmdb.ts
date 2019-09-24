import needle from 'needle'
import { tmdbFindMovieResponse, Movieresult, TmdbGenres, Genre } from '../tmdb/tmdbModels'
import { config } from '../config/config'

const tmdbUrl = 'https://api.themoviedb.org/3/'
const tmdbEndpoint = 'find'
const tmdbApiKey = config.get('tmdb.token')
export const tmdbThumbnailURL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2'

export async function getMovieInfo(imdbID: String): Promise<Movieresult> {
  const url = `${tmdbUrl}${tmdbEndpoint}/${imdbID}?api_key=${tmdbApiKey}&language=en-US&external_source=imdb_id`
  try {
    const resp = await needle('get', url)
    const tmdbResponse: tmdbFindMovieResponse = resp.body
    const tmdbMovieDetails: Movieresult = tmdbResponse.movie_results[0]
    return tmdbMovieDetails
  } catch (error) {
    throw new Error(error.message)
  }
}

export async function getGenres(): Promise<Genre[]> {
  const url = `${tmdbUrl}genre/movie/list?api_key=${tmdbApiKey}`
  try {
    const resp = await needle('get', url)
    const TmdbRespBody: TmdbGenres = resp.body
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
