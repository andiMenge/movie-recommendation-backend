import * as mongoose from 'mongoose';
import { MovieSchema, MovieModel, MovieResponse, InputData } from '../models/movie';
import { Request, Response } from 'express';
import * as needle from 'needle';
import { tmdbFindMovieResponse, Movieresult } from '../models/tmdb';

const movie = mongoose.model<MovieModel>('Movie', MovieSchema);
const tmdbUrl = 'https://api.themoviedb.org/3/'
const tmdbEndpoint = 'find'
const tmdbApiKey = process.env.TMDB_API_KEY
const tmdbThumbnailURL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2'

export class MovieController {

  public async createMovie (req: Request, res: Response) {
    const inputData: InputData = req.body
    const imdbURL = inputData.url
    const imdbID = this.getImdbIDfromImdbURL(imdbURL)
    const tmdbResponse: tmdbFindMovieResponse  = await this.getMovieDetails(imdbID)
    const tmdbMovieDetails: Movieresult = tmdbResponse.movie_results[0]
    const newMovie = this.constructMovie(tmdbMovieDetails, imdbID)

    const duplicate = await this.isDuplicate(imdbID)
    console.log(duplicate)

    if (!duplicate) {
      newMovie.save((err, movie) => {
        if(err){
          res.send(err);
        }    
        res.json(movie);
      });
    } else {
      res.sendStatus(406)
    }
  }

  public async getMovies (req: Request, res: Response) {
    const results = await movie.find({}).sort({release_date: -1})
    const movieResponse: MovieResponse = {
      movies: results
    }
    res.json(movieResponse)
  }

  private async getMovieDetails(id: String) {
    const url = `${tmdbUrl}${tmdbEndpoint}/${id}?api_key=${tmdbApiKey}&language=en-US&external_source=imdb_id`
    try {
      const resp = await needle('get', url)
      return resp.body
    } catch (error) {
      console.log(error.message);
    }
  }

  private getImdbIDfromImdbURL(url: String) {
    const imdbID = url.substring(27,36)
    return imdbID
  }

  private constructMovie(tmdbMovieDetails: Movieresult, imdbURL: string) {
    const newMovie = new movie();
    try {
      newMovie.original_title = tmdbMovieDetails.title
      newMovie.image_url = `${tmdbThumbnailURL}${tmdbMovieDetails.poster_path}`
      newMovie.is_highlight = false
      newMovie.imdb_id = imdbURL
      newMovie.release_date = tmdbMovieDetails.release_date
      return newMovie
    } catch (error) {
      console.log(error)
    }
  }

  private async isDuplicate(id: string):Promise<boolean> {
    try {
      const result = await movie.findOne({ imdb_id: id })
      if (result === null) {
        return false
      } else {
        return true
      }
    } catch (error) {
      console.log(error)
    }
  }

}