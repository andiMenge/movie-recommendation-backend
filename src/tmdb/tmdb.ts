import needle from 'needle'
import { tmdbFindMovieResponse, Movieresult, TmdbGenres, Genre } from '../tmdb/tmdbModels'
import { config } from '../config/config'

export default class Tmdb {
  tmdbUrl: string
  tmdbEndpoint: string
  tmdbApiKey: string
  tmdbThumbnailURL: string

  constructor() {
    this.tmdbUrl = 'https://api.themoviedb.org/3/'
    this.tmdbEndpoint = 'find'
    this.tmdbApiKey = config.get('tmdb.token')
    this.tmdbThumbnailURL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2'
  }

  public async getMovieInfo(imdbID: String): Promise<Movieresult> {
    const url = `${this.tmdbUrl}${this.tmdbEndpoint}/${imdbID}?api_key=${this.tmdbApiKey}&language=en-US&external_source=imdb_id`
    try {
      const resp = await needle('get', url)
      const tmdbResponse: tmdbFindMovieResponse = resp.body
      const tmdbMovieDetails: Movieresult = tmdbResponse.movie_results[0]
      return tmdbMovieDetails
    } catch (error) {
      console.log(error.message)
      throw new Error('get movie info from tmdb failed')
    }
  }

  public async getGenres(): Promise<Genre[]> {
    const url = `${this.tmdbUrl}genre/movie/list?api_key=${this.tmdbApiKey}`
    try {
      const resp = await needle('get', url)
      const TmdbRespBody: TmdbGenres = resp.body
      return TmdbRespBody.genres
    } catch (error) {
      console.log(error.message)
      throw new Error('get genres from tmdb failed')
    }
  }

  public async getGenreNamesfromGenreIds(genre_ids: number[]): Promise<string[]> {
    const genreNames: string[] = []
    try {
      const tmdbGenres: Genre[] = await this.getGenres()
      for (const genreId of genre_ids) {
        for (const tmdbGenre of tmdbGenres) {
          if (genreId === tmdbGenre.id) {
            genreNames.push(tmdbGenre.name)
          }
        }
      }
      return genreNames
    } catch (error) {
      console.log(error.message)
      throw new Error('could not compute genre names')
    }
  }
}
