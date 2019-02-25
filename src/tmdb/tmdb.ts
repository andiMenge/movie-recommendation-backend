import * as needle from 'needle'
import { tmdbFindMovieResponse, Movieresult } from '../tmdb/tmdbModels'

export default class Tmdb {
  tmdbUrl: string
  tmdbEndpoint: string
  tmdbApiKey: string
  tmdbThumbnailURL: string

  constructor() {
    this.tmdbUrl = 'https://api.themoviedb.org/3/'
    this.tmdbEndpoint = 'find'
    this.tmdbApiKey = process.env.TMDB_API_KEY
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
}